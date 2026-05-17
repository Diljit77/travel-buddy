import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateTripPlanGemini = async (prompt: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  let text = response.text();

  // 🔥 Fix JSON issues
  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Invalid JSON from Gemini", raw: text };
  }
};