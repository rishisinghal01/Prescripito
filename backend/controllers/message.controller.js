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

    const aiText =
      response.data.candidates[0].content.parts[0].text;

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
    res.json({ success: false, message: err.message });
  }
};

const imagemessageControlller = async (req, res) => {
  try {
    const { chatId, prompt, isPublished } = req.body;
    const userId = req.userId;

    const chat = await chatModel.findOne({ _id: chatId, userId });

    if (!chat)
      return res.json({ success: false, message: "Chat not found" });

    // 1️⃣ FIRST SAVE USER MESSAGE IN DB
    const userMsg = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(userMsg);

    // 2️⃣ GENERATE IMAGE
    const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
    const URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

    const response = await axios.post(
      URL,
      { inputs: prompt },
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");

    // 3️⃣ CREATE AI MESSAGE
    const aiMsg = {
      role: "assistant",
      isImage: true,
      content: `data:image/png;base64,${base64}`,
      timestamp: Date.now(),
      isPublished: isPublished || false,
    };

    // 4️⃣ SAVE AI MESSAGE IN DB
    chat.messages.push(aiMsg);

    // 5️⃣ UPDATE USER CREDITS
    await userModel.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // 6️⃣ SAVE CHAT
    await chat.save();

    return res.json({ success: true, reply: aiMsg });

  } catch (err) {
    console.log("IMAGE ERROR:", err.message);
    return res.json({ success: false, message: "Image generation failed" });
  }
};
export { textMessageController, imagemessageControlller }