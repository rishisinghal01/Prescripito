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
      // Fallback for demo if API fails (e.g. 429 Rate Limit)
      aiText = "I'm currently receiving too many requests (API Rate Limit). But as a general health tip: always stay hydrated, eat a balanced diet, and consult a real doctor for medical advice!";
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

    // 2️⃣ CALL LOCAL PYTHON ML SERVICE FOR MEDICAL ANALYSIS
    let aiText = "";
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          image: base64Image
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      const ml_data = response.data;
      if (ml_data.success) {
        aiText = `**Analysis Complete (Local ML Model)**\n\n**Prediction:** ${ml_data.diagnosis}\n\n*Extracted Features (RGB Mean):* R=${ml_data.features_extracted.R_mean}, G=${ml_data.features_extracted.G_mean}, B=${ml_data.features_extracted.B_mean}\n\n*Note: This is a custom-trained Scikit-Learn model analyzing the visual features of your image.*`;
      } else {
        aiText = "ML Model failed to analyze the image: " + ml_data.error;
      }
    } catch (apiError) {
      console.log("Local ML API Error:", apiError.message);
      aiText = "The local Python ML server is currently unreachable. Please make sure `python3 app.py` is running in the ml_service directory.";
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