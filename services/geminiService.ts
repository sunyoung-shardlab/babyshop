
import { GoogleGenAI, Type } from "@google/genai";

export async function generateReviewText(keywords: string[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Write a short, warm, and helpful product review for a Korean baby store in Malaysia. 
  The user selected these keywords: ${keywords.join(', ')}. 
  Make it sound like a happy mother's recommendation. Keep it within 30-50 words. Language: English.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "My baby loves this product! Highly recommended.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "This product is amazing. My baby enjoyed it so much!";
  }
}
