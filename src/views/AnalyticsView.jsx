import { useState, useEffect } from "react";
import useHabits from "../hooks/useHabits";
import useAnalytics from "../hooks/useAnalytics";
import { generateWeeklyInsight, getDailyInsight, saveDailyInsight } from "../services/aiService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
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
        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - 10 * 86400000);
        const recentEntries = entries
            .filter(e => new Date(e.date) >= tenDaysAgo)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (recentEntries.length < 2) {
            showToast("You need at least 2 entries from the last 10 days to generate an insight.", "error");
            setIsGenerating(false);
            return;
        }

        const insight = await generateWeeklyInsight(recentEntries);
        if (insight) {
            setAiInsight(insight);
            setHasGeneratedToday(true);
            await saveDailyInsight(user.uid, insight);
            showToast("Your Soul Insight is ready and saved! ✨");
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
        alert('Score copied to clipboard! 🚀');
    }
  };

  return (
    <div className="rounded-3xl p-8 transition-all space-y-12">
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
      <div className="p-8 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-inner">
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-widest">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent-happy)]/20 flex items-center justify-center text-sm">📈</span>
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
