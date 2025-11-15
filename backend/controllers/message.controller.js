import imagekit from "../config/imagekit.js";
import openai from "../config/openai.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios'
const textMessageController = async (req, res) => {
    try {
        const userId = req.userId;
        const user=await userModel.findById(userId);
        if(user.credits<1){
            res.json({success:false,message:"You don't have enough credits"})
        }
        const { chatId, prompt } = req.body
        const chat = await chatModel.findOne({ userId, _id: chatId })
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })


        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        res.json({ success: true, reply })
        chat.messages.push(reply)
        await chat.save();
        await userModel.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    }
    catch (err) {
        res.json({ success: false, message: err.message })
    }
}






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