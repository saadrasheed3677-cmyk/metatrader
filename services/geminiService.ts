
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'KULIBRE AI', the assistant for Kulibre's AI-Powered Multi-Data Trading Workflow.
      
      Product Context: An autonomous n8n pipeline for automated trading.
      Key Features to highlight:
      - 99%+ Accuracy.
      - 6 Intelligence Layers (Market Data, Screenshot, News, Tech Analysis, Decision, Execution).
      - Uses Gemini 2.5 Flash for analysis.
      - Trades on Alpaca (Spot) and Binance Futures.
      
      Tone: Professional, technical, concise, precise. Use emojis like 📈, 🤖, ⚡️, 🔒.
      
      Keep responses short (under 50 words). If asked about pricing, mention the 'Access' section.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};
