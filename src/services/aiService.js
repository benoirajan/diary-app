import { getGenerativeModel } from "@firebase/vertexai";
import { db, remoteConfig, vertexAI } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { fetchAndActivate, getString } from "firebase/remote-config";

// Remote Config setup
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
  aiModel: 'gemini-2.5-flash',
  insightModel: 'gemini-3.5-flash'
};

const getAIModelName = async () => {
  try {
    await fetchAndActivate(remoteConfig);
    return getString(remoteConfig, "aiModel");
  } catch (error) {
    console.error("Remote Config fetch failed, using default:", error);
    return 'gemini-1.5-flash';
  }
};

const getInsightModelName = async () => {
  try {
    await fetchAndActivate(remoteConfig);
    return getString(remoteConfig, "insightModel");
  } catch (error) {
    console.error("Remote Config fetch failed, using default:", error);
    return 'gemini-1.5-flash';
  }
};

/**
 * Analyzes the sentiment of diary content and maps it to SoulScript moods.
 * @param {string} content - The diary text to analyze.
 * @returns {Promise<string|null>} - The discovered mood value or null.
 */
export const discoverMood = async (content) => {
  if (!content || content.trim().length < 20) return null;

  try {
    const modelName = await getAIModelName();
    const model = getGenerativeModel(vertexAI, { 
      model: modelName,
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
    });

    const result = await model.generateContent(content);
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

/**
 * Generates a personalized weekly summary/insight based on recent journal entries.
 * @param {Array} entries - Array of recent diary entries.
 * @returns {Promise<string|null>} - The generated insight or null.
 */
export const generateWeeklyInsight = async (entries) => {
  if (!entries || entries.length === 0) return null;

  try {
    const modelName = await getInsightModelName();
    const model = getGenerativeModel(vertexAI, {
      model: modelName,
      systemInstruction: `
        You are SoulScript's empathetic journaling assistant. Your goal is to provide deep, personalized insights based on a user's recent entries.
        
        Style Guide:
        - Tone: Empathetic, warm, minimalist, and encouraging.
        - Persona: A wise, futuristic companion.
        - Structure: 2-3 short, impactful paragraphs.
        
        Instructions:
        1. Analyze the provided entries for emotional patterns, recurring themes, or correlations between mood and activities.
        2. Provide one specific "Soul Observation" about their week.
        3. Offer one gentle "Growth Spark" or actionable suggestion for the coming days.
        4. Do NOT explicitly quote sensitive journal content, but refer to the 'feelings' and 'patterns' generally.
        5. Use simple, clear language. No corporate jargon.
      `,
    });

    const entriesSummary = entries
      .map((e) => `Date: ${new Date(e.date).toDateString()}, Mood: ${e.mood}, Content: ${e.title}\n${e.content}`)
      .join("\n---\n");

    const result = await model.generateContent(`Here are my recent journal entries from the past week:\n\n${entriesSummary}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Insight generation failed:", error);
    return null;
  }
};

/**
 * Saves a generated insight to Firestore.
 */
export const saveDailyInsight = async (userId, insight) => {
  if (!userId || !insight) return;

  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, "users", userId, "aiInsights", "history");

  try {
    const snap = await getDoc(ref);
    let insights = {};
    
    if (snap.exists()) {
      insights = snap.data().insights || {};
    }

    // Add/Update today's insight
    insights[today] = insight;

    // Prune history (keep last 30 insights)
    const sortedDates = Object.keys(insights).sort().reverse();
    if (sortedDates.length > 30) {
      const keptDates = sortedDates.slice(0, 30);
      const newInsights = {};
      keptDates.forEach(d => { newInsights[d] = insights[d]; });
      insights = newInsights;
    }

    await setDoc(ref, {
      insights,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving daily insight:", error);
  }
};

/**
 * Fetches the AI insight for a specific date or the latest one.
 */
export const getDailyInsight = async (userId, date = null) => {
  if (!userId) return null;

  const targetDate = date || new Date().toISOString().split('T')[0];
  const ref = doc(db, "users", userId, "aiInsights", "history");
  
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const insights = snap.data().insights || {};
      if (insights[targetDate]) {
        return { 
          content: insights[targetDate], 
          date: targetDate 
        };
      }
    }
  } catch (error) {
    console.error("Error fetching daily insight:", error);
  }
  
  return null;
};
