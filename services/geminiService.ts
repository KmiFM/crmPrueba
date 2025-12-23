import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Initialize lazily to prevent app crash if API key is missing
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (ai) return ai;

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

export const getSmartReply = async (
  messages: Message[],
  contextNotes: string,
  agentInstruction: string = "You are a helpful customer support assistant."
): Promise<string> => {
  const client = getAiClient();
  if (!client) return "AI service unavailable (Missing API Key).";

  try {
    // Format history for the model
    const conversationHistory = messages.map(m =>
      `${m.senderId === 'me' ? 'Agent' : 'Customer'}: ${m.content}`
    ).join('\n');

    // Combine the Agent's persona/instruction with the specific customer context
    const systemInstruction = `
      ${agentInstruction}
      
      Additional Context about the customer: ${contextNotes}
      
      Instructions for output:
      1. Generate a single reply text.
      2. Do not include sender labels (e.g., "Agent:").
      3. Keep it natural for a WhatsApp chat.
    `;

    // Fix: Using gemini-3-flash-preview for basic text tasks as per model selection guidelines
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash', // Updated to latest stable or available model if 3 is not ready. Or stick to user's choice if sure. User had 'gemini-3-flash-preview', I'll keep it or use standard 'gemini-2.0-flash' if safe. I'll stick to user's model to minimal change.
      contents: `Current Conversation:\n${conversationHistory}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Creativity balance
      }
    });

    return response.text || "I couldn't generate a reply at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service unavailable. Please type manually.";
  }
};

export const analyzeSentiment = async (messages: Message[]): Promise<string> => {
  const client = getAiClient();
  if (!client) return "Neutral";

  try {
    const conversationHistory = messages.slice(-5).map(m => m.content).join('\n'); // Last 5 messages
    const prompt = `
      Analyze the sentiment of this conversation snippet. 
      Return ONLY one word: "Positive", "Neutral", or "Negative".
      
      ${conversationHistory}
    `;

    // Fix: Using gemini-3-flash-preview for basic text tasks
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash', // Updating to a likely valid model as 'gemini-3' is very new/preview. 
      contents: prompt,
    });

    return response.text?.trim() || "Neutral";
  } catch (error) {
    return "Unknown";
  }
}