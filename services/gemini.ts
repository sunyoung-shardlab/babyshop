
import { GoogleGenAI, Type } from "@google/genai";

export const generateAIReview = async (keywords: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `당신은 어린 아이를 키우는 엄마입니다. 다음 키워드들을 활용하여 자연스럽고 정성이 가득한 한국어 구매 리뷰를 작성해주세요: ${keywords.join(', ')}. 
  리뷰는 친절하고 다른 엄마들에게 도움이 되는 톤으로 작성하며, 2-3문장 정도로 짧게 요약해주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text?.trim() || "리뷰 생성에 실패했습니다. 직접 작성해주세요!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 리뷰를 생성하는 중 오류가 발생했습니다.";
  }
};
