import { useState, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics as fbAnalytics } from "../firebase";
import useHabits from "../hooks/useHabits";
import useAnalytics from "../hooks/useAnalytics";
import { generateWeeklyInsight, getDailyInsight, saveDailyInsight } from "../services/aiService";
import { getEntriesPaginated } from "../services/entryService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useSecurity } from "../context/SecurityContext";
import { useRemoteConfig } from "../context/RemoteConfigContext";

// Components
import MoodChart from "../components/analytics/MoodChart";
import AiInsightCard from "../components/analytics/AiInsightCard";
import WellBeingCard from "../components/analytics/WellBeingCard";
import HabitMoodInsights from "../components/analytics/HabitMoodInsights";
import StreakCard from "../components/analytics/StreakCard";
import HabitPerformance from "../components/analytics/HabitPerformance";
import WritingStats from "../components/analytics/WritingStats";
import MoodDistribution from "../components/analytics/MoodDistribution";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";

const AnalyticsView = ({ entries = [] }) => {
  const { habits } = useHabits();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { decryptEntry } = useSecurity();
  const { config: remoteConfig } = useRemoteConfig();
  const [aiInsight, setAiInsight] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedToday, setHasGeneratedToday] = useState(false);

  const analytics = useAnalytics(entries, habits);

  // Fetch today's insight on mount
  useEffect(() => {
    const fetchTodayInsight = async () => {
        if (!user || !remoteConfig.isAiEnabled) return;
        const stored = await getDailyInsight(user.uid);
        if (stored) {
            setAiInsight(stored.content);
            setHasGeneratedToday(true);
        }
    };
    fetchTodayInsight();
  }, [user, remoteConfig.isAiEnabled]);

  const handleGenerateInsight = async () => {
    if (!remoteConfig.isAiEnabled) return;
    if (hasGeneratedToday) {
        showToast("You've already received your Soul Insight for today. Come back tomorrow! ✨");
        return;
    }

    setIsGenerating(true);
    try {
        // To provide a truly deep insight, we need the full content of recent entries,
        // not just the metadata (mood/date) passed in via the 'entries' prop.
        const result = await getEntriesPaginated(user.uid, 10);
        
        if (result.entries.length < 2) {
            showToast("You need at least 2 entries to generate a deep Soul Insight.", "error");
            setIsGenerating(false);
            return;
        }

        // Decrypt the entries so the AI can analyze the actual text
        const richEntries = await Promise.all(
            result.entries.map(entry => decryptEntry(entry))
        );

        const insight = await generateWeeklyInsight(richEntries);
        if (insight) {
            setAiInsight(insight);
            setHasGeneratedToday(true);
            await saveDailyInsight(user.uid, insight);
            showToast("Your Soul Insight is ready and saved! ✨");
            
            // Track successful insight generation
            logEvent(fbAnalytics, "generate_ai_insight", {
                entries_count: richEntries.length
            });
        } else {
            showToast("AI couldn't generate an insight right now.", "error");
        }
    } catch (err) {
        console.error("AI Insight failed:", err);
        showToast("AI Insight generation failed. Please try again later.", "error");
    } finally {
        setIsGenerating(false);
    }
  };

  const shareWellBeing = () => {
    const text = `My SoulScript Well-being Score is ${analytics.wellBeingScore} (${analytics.currentLevel.label} ${analytics.currentLevel.emoji})! 📊✨\n\nTrack your mood and habits with SoulScript.`;
    if (navigator.share) {
        navigator.share({
            title: 'My SoulScript Well-being',
            text: text,
            url: window.location.origin
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text);
        showToast('Score copied to clipboard! 🚀');
    }
  };

  return (
    <div className="rounded-3xl transition-all space-y-12 md:px-4 lg:px-8">
      <AnalyticsHeader smartMessages={analytics.smartMessages} />

      <AiInsightCard 
        isAiEnabled={remoteConfig.isAiEnabled}
        aiInsight={aiInsight}
        isGenerating={isGenerating}
        hasGeneratedToday={hasGeneratedToday}
        onGenerate={handleGenerateInsight}
        onClear={() => setAiInsight(null)}
        entriesCount={entries.length}
      />

      <WellBeingCard 
        analytics={analytics}
        onShare={shareWellBeing}
      />

      {/* 2. 📈 Mood Trend Graph */}
      <div className="p-6 md:p-10 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-inner">
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-widest">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent-happy)]/20 flex items-center justify-center text-lg">📈</span>
            Mood Journey
        </h3>
        <MoodChart data={analytics.moodChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HabitMoodInsights insights={analytics.habitInsights} />
        
        <StreakCard 
            currentStreak={analytics.currentStreak}
            longestStreak={analytics.longestStreak}
            breakPattern={analytics.breakPattern}
        />
      </div>

      <HabitPerformance performance={analytics.habitPerformance} />

      <WritingStats 
        totalEntries={analytics.totalEntries}
        consistencyScore={analytics.consistencyScore}
        avgEntriesPerWeek={analytics.avgEntriesPerWeek}
        bestWritingDay={analytics.bestWritingDay}
      />

      <MoodDistribution moodCount={analytics.moodCount} />
    </div>
  );
};

export default AnalyticsView;
