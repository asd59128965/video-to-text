
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FileData } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const transcribeAudio = async (fileData: FileData): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure environment variable is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = "請將這段音訊內容精確地轉錄為繁體中文逐字稿。如果是對話，請區分發言者（如：發言者 A、發言者 B）。請保留原始語意，修正明顯的贅字與口癖，並適當標註時間點。輸出必須完全使用繁體中文。";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: fileData.base64,
              mimeType: fileData.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: "你是一位專業的語音轉錄與翻譯專家，擅長處理繁體中文逐字稿。你的目標是提供高度準確且易於閱讀的文字記錄。",
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("模型未返回任何轉錄內容。");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Transcription Error:", error);
    throw new Error(error.message || "發生未知錯誤，請稍後再試。");
  }
};

export const generateSummary = async (transcript: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `請根據以下逐字稿內容，整理成一份專業的會議記錄。
  內容必須包含以下結構：
  1. 會議概述 (Summary)
  2. 核心討論重點 (Key Discussion Points)
  3. 行動事項與後續追蹤 (Action Items)
  
  請務必使用專業的繁體中文，格式請清晰易讀。
  
  逐字稿內容如下：
  ${transcript}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "你是一位資深的行政與會議助理，擅長從混亂的對話中提取核心價值，並轉化為結構化的專業會議記錄。",
        temperature: 0.3,
      },
    });
    return response.text || "無法產生摘要。";
  } catch (error: any) {
    throw new Error("產生會議記錄失敗: " + error.message);
  }
};
