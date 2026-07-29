import fs from 'fs';
import imagekit from "../config/imagekit.js";
// import { geminiModel } from "../config/gemini.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios'
const textMessageController = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId, prompt } = req.body;

    const user = await userModel.findById(userId);
    if (user.credits < 1) {
      return res.json({ success: false, message: "Not enough credits" });
    }

    const chat = await chatModel.findOne({ _id: chatId, userId });

    chat.messages.push({
      role: "user",
      content: prompt,
      isImage: false,
      timestamp: Date.now(),
    });

    let aiText = "";
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a general health and wellness information assistant.
Educational info only. No diagnosis. No prescriptions.

User: ${prompt}
                  `,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            key: process.env.GEMINI_API_KEY,
          },
        }
      );
      aiText = response.data.candidates[0].content.parts[0].text;
    } catch (apiError) {
      console.log("Gemini API Error:", apiError.message);
      // Fallback to OpenRouter (Free Models)
      try {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("Missing OpenRouter API Key");
        }

        const freeModels = [
            "google/gemma-4-26b-a4b-it:free",
            "nvidia/nemotron-3-nano-omni:free",
            "google/gemini-2.0-flash-lite-preview-02-05:free",
            "meta-llama/llama-3.1-8b-instruct:free"
        ];

        let dsResponse = null;
        let lastError = null;

        for (const model of freeModels) {
            try {
                dsResponse = await axios.post(
                  "https://openrouter.ai/api/v1/chat/completions",
                  {
                    model: model,
                    messages: [
                      { role: "system", content: "You are a general health and wellness information assistant. Educational info only. No diagnosis. No prescriptions." },
                      { role: "user", content: prompt }
                    ]
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                    }
                  }
                );
                break; // Break the loop if successful!
            } catch (err) {
                console.log(`OpenRouter Model ${model} Failed:`, err.response?.data?.error?.message || err.message);
                lastError = err;
            }
        }

        if (!dsResponse) {
            throw lastError; // If all models fail, throw the last error
        }

        aiText = dsResponse.data.choices[0].message.content;
      } catch (dsError) {
        console.log("OpenRouter API Error:", dsError.message);
        if (dsError.message === "Missing OpenRouter API Key") {
            aiText = "Oops! Gemini limit is reached, and the fallback cannot be used because the 'OPENROUTER_API_KEY' is missing in the backend .env file. Please add your OpenRouter API key!";
        } else {
            const errorDetail = dsError.response?.data?.error?.message || dsError.message;
            aiText = `OpenRouter Fallback Failed: ${errorDetail}. Please check your OpenRouter API key.`;
        }
      }
    }

    const reply = {
      role: "assistant",
      content: aiText,
      isImage: false,
      timestamp: Date.now(),
    };

    chat.messages.push(reply);
    await chat.save();

    await userModel.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    res.json({ success: true, reply });

  } catch (err) {
    fs.writeFileSync('error.log', "OUTER CATCH: " + err.message + "\n" + err.stack);
    res.json({ success: false, message: err.message });
  }
};

const analyzeImageController = async (req, res) => {
  try {
    const { chatId, prompt, base64Image } = req.body;
    const userId = req.userId;

    const chat = await chatModel.findOne({ _id: chatId, userId });

    if (!chat)
      return res.json({ success: false, message: "Chat not found" });

    // 1️⃣ SAVE USER MESSAGE IN DB (Do not save base64 to avoid DB bloat)
    const userMsg = {
      role: "user",
      content: prompt || "Analyze this medical image.",
      timestamp: Date.now(),
      isImage: false, // Keep false so UI just shows the text prompt
    };

    chat.messages.push(userMsg);

    // 2️⃣ CALL OPENROUTER VISION API FOR REAL MEDICAL ANALYSIS
    let aiText = "";
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("Missing OpenRouter API Key");
      }
      
      // Ensure the image string has the proper base64 prefix
      const formattedBase64 = base64Image.startsWith("data:image") 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`;

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemma-4-26b-a4b-it:free", // Free Vision-capable model from 2026 screenshot URL slug
          messages: [
            { 
              role: "system", 
              content: "You are a professional medical image analysis assistant. Provide a detailed, educational analysis of the provided medical image (e.g., MRI, X-Ray, Skin condition). Point out visible anomalies if any. Disclaimer: State that this is for educational purposes and not a clinical diagnosis." 
            },
            { 
              role: "user", 
              content: [
                { type: "text", text: prompt || "Please analyze this medical image in detail." },
                { type: "image_url", image_url: { url: formattedBase64 } }
              ] 
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
          }
        }
      );
      
      aiText = response.data.choices[0].message.content;
    } catch (apiError) {
      console.log("Vision API Error:", apiError.response?.data?.error?.message || apiError.message);
      aiText = `Image Analysis Failed: ${apiError.response?.data?.error?.message || apiError.message}. Please try again later.`;
    }

    // 3️⃣ CREATE AI MESSAGE
    const aiMsg = {
      role: "assistant",
      isImage: false,
      content: aiText,
      timestamp: Date.now(),
      isPublished: false,
    };

    // 4️⃣ SAVE AI MESSAGE IN DB
    chat.messages.push(aiMsg);

    // 5️⃣ UPDATE USER CREDITS (Deduct 2 credits for image analysis)
    await userModel.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // 6️⃣ SAVE CHAT
    await chat.save();

    return res.json({ success: true, reply: aiMsg });

  } catch (err) {
    console.log("ANALYSIS ERROR:", err.message);
    return res.json({ success: false, message: "Image analysis failed" });
  }
};
export { textMessageController, analyzeImageController }