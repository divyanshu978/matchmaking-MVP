import { GoogleGenerativeAI } from '@google/generative-ai';

const client = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function generateAiCopy(prompt: string, fallback: string) {
  if (!client) {
    return fallback;
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    return response.response.text().trim() || fallback;
  } catch {
    return fallback;
  }
}