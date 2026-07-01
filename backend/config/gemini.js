import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ THIS MODEL WORKS FOR EVERYONE
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

export { geminiModel };