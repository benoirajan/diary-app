import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Analyzes the sentiment of diary content and maps it to SoulScript moods.
 * @param {string} content - The diary text to analyze.
 * @returns {Promise<string|null>} - The discovered mood value or null.
 */
export const discoverMood = async (content) => {
  if (!genAI || !content || content.trim().length < 20) return null;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent classification
        topP: 0.1,
        maxOutputTokens: 10,
      }
    });

    const prompt = `
      You are an emotional analysis engine for SoulScript, a mindful journaling app.
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

      Diary Entry:
      "${content}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().toLowerCase().trim();

    // Validate that the AI returned a valid mood
    const validMoods = ["radiant", "joyful", "peaceful", "down", "rough"];
    return validMoods.includes(text) ? text : "peaceful";
  } catch (error) {
    console.error("Mood discovery failed:", error);
    return null;
  }
};
