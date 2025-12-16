import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Initialize the client. 
// NOTE: In a real app, ensure API_KEY is set in environment variables.
// The code assumes process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy_key_for_demo' });

export const getSmartReply = async (
  messages: Message[], 
  contextNotes: string, 
  agentInstruction: string = "You are a helpful customer support assistant."
): Promise<string> => {
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
   try {
    const conversationHistory = messages.slice(-5).map(m => m.content).join('\n'); // Last 5 messages
    const prompt = `
      Analyze the sentiment of this conversation snippet. 
      Return ONLY one word: "Positive", "Neutral", or "Negative".
      
      ${conversationHistory}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Neutral";
  } catch (error) {
    return "Unknown";
  }
}