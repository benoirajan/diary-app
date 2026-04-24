import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create the client
const client = API_KEY ? new GoogleGenAI({
  apiKey: API_KEY,
}) : null;

/**
 * Analyzes the sentiment of diary content and maps it to SoulScript moods.
 * Uses the latest Gemini Flash Lite model with system instructions.
 * @param {string} content - The diary text to analyze.
 * @returns {Promise<string|null>} - The discovered mood value or null.
 */
export const discoverMood = async (content) => {
  if (!client || !content || content.trim().length < 20) return null;

  try {
    const model = 'gemini-flash-lite-latest';
    
    const config = {
      temperature: 0.1,
      systemInstruction: `
        Analyze the diary entry below and categorize it into EXACTLY ONE of these five moods:
        - radiant (extreme joy, success, high energy)
        - joyful (happy, positive, light-hearted)
        - peaceful (calm, steady, balanced, baseline)
        - down (low energy, sad, heavy, tired)
        - rough (high distress, overwhelmed, high friction)

        Rules:
        1. Return ONLY the single word representing the mood (radiant, joyful, peaceful, down, or rough).
        2. Do not include punctuation, explanations, or any other text.
        3. If unsure, default to 'peaceful'.
      `,
    };

    const response = await client.models.generateContent({
      model,
      config,
      contents: [content],
    });

    const text = response.text.toLowerCase().trim();

    // Validate that the AI returned a valid mood
    const validMoods = ["radiant", "joyful", "peaceful", "down", "rough"];
    return validMoods.includes(text) ? text : "peaceful";
  } catch (error) {
    console.error("Mood discovery failed:", error);
    return null;
  }
};
