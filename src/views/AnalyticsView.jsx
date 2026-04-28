import { useMemo, useState, useEffect } from "react";
import { moods, getMoodLabel, getMoodEmoji, getMoodScore } from '../constants/moods';
import useHabits from "../hooks/useHabits";
import ReactMarkdown from 'react-markdown';
import { generateWeeklyInsight, getDailyInsight, saveDailyInsight } from "../services/aiService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useRemoteConfig } from "../context/RemoteConfigContext";

const MoodChart = ({ data = [] }) => {
  if (data.length < 2) return (
    <div className="h-48 flex items-center justify-center border border-dashed border-[var(--bg-soft)] rounded-2xl text-[var(--text-secondary)] italic text-sm">
        Not enough data yet to plot your mood journey...
    </div>
  );

  const width = 800;
  const height = 200;
  const padding = 40;
  
  const moodEmojis = moods.reduce((acc, m) => {
    acc[getMoodScore(m.value)] = m.emoji;
    return acc;
  }, {});

  const maxValue = 5;
  const minValue = 1;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / (data.length - 1));
    const y = height - (padding + ((d.score - minValue) * (height - 2 * padding) / (maxValue - minValue)));
    return { x, y, ...d };
  });

  const linePath = points.reduce((path, p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, ""
  );

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[600px] h-[240px] relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-[0_0_10px_var(--glow-color)]">
                {/* Grid Lines */}
                {[1, 2, 3, 4, 5].map(v => {
                    const y = height - (padding + ((v - minValue) * (height - 2 * padding) / (maxValue - minValue)));
                    return (
                        <g key={v}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--bg-soft)" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-[var(--text-secondary)] font-bold">{moodEmojis[v]}</text>
                        </g>
                    );
                })}

                {/* The Path */}
                <path d={linePath} fill="none" stroke="var(--accent-happy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
                
                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i} className="group/point">
                        <circle cx={p.x} cy={p.y} r="6" fill="var(--bg-card)" stroke="var(--accent-happy)" strokeWidth="3" className="transition-all hover:r-8 cursor-pointer" />
                        <text x={p.x} y={height - 10} textAnchor="middle" className="text-[9px] fill-[var(--text-secondary)] font-bold uppercase tracking-tighter opacity-60">
                            {p.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    </div>
  );
};

const AnalyticsView = ({ entries = [] }) => {
  const { habits } = useHabits();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { config: remoteConfig } = useRemoteConfig();
  const [aiInsight, setAiInsight] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedToday, setHasGeneratedToday] = useState(false);

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
  /*
    =========================
    Derived Analytics
    =========================
  */
  const analytics = useMemo(() => {
    const totalEntries = entries.length;

    const moodCount = {};
    const entriesPerDay = {};

    entries.forEach((entry) => {
      // Mood distribution
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;

      // Entries per day
      const dateKey = new Date(entry.date).toDateString();
      entriesPerDay[dateKey] =
        (entriesPerDay[dateKey] || 0) + 1;
    });

    const mostCommonMood =
      Object.entries(moodCount).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "N/A";

    // Streak and Patterns
    const sortedUniqueDays = Object.keys(entriesPerDay)
      .map(d => new Date(d).getTime())
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    if (sortedUniqueDays.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayMs = today.getTime();
      const yesterdayMs = todayMs - 86400000;

      // Current Streak
      if (sortedUniqueDays[0] >= yesterdayMs) {
        let expected = sortedUniqueDays[0];
        for (const day of sortedUniqueDays) {
          if (day === expected) {
            currentStreak++;
            expected -= 86400000;
          } else break;
        }
      }

      // Longest Streak
      let expected = sortedUniqueDays[0];
      for (const day of sortedUniqueDays) {
        if (day === expected) {
          tempStreak++;
          expected -= 86400000;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          expected = day - 86400000;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Break Pattern
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const missedDaysCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    if (sortedUniqueDays.length > 1) {
      for (let i = 0; i < sortedUniqueDays.length - 1; i++) {
        const diff = (sortedUniqueDays[i] - sortedUniqueDays[i+1]) / 86400000;
        if (diff > 1) {
          // Check which days were missed
          for (let j = 1; j < diff; j++) {
            const missedDate = new Date(sortedUniqueDays[i+1] + (j * 86400000));
            missedDaysCount[missedDate.getDay()]++;
          }
        }
      }
    }

    const mostMissedDayIdx = Object.entries(missedDaysCount).sort((a, b) => b[1] - a[1])[0][0];
    const breakPattern = missedDaysCount[mostMissedDayIdx] > 0 
      ? `You usually miss on ${dayNames[mostMissedDayIdx]}s` 
      : "No clear break pattern yet!";

    // Habit vs Mood Correlation
    const dailyAvgMood = {};
    entries.forEach(entry => {
        const dateKey = new Date(entry.date).toDateString();
        if (!dailyAvgMood[dateKey]) dailyAvgMood[dateKey] = [];
        dailyAvgMood[dateKey].push(getMoodScore(entry.mood));
    });

    Object.keys(dailyAvgMood).forEach(date => {
        const scores = dailyAvgMood[date];
        dailyAvgMood[date] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    const habitInsights = habits.map(habit => {
        const completedDays = habit.completions || [];
        const moodWhenCompleted = [];
        const moodWhenNotCompleted = [];

        Object.entries(dailyAvgMood).forEach(([dateStr, avgMood]) => {
            const dateObj = new Date(dateStr);
            const dateIso = dateObj.toISOString().split('T')[0];
            if (completedDays.includes(dateIso)) {
                moodWhenCompleted.push(avgMood);
            } else {
                moodWhenNotCompleted.push(avgMood);
            }
        });

        if (moodWhenCompleted.length > 0) {
            const avgCompleted = moodWhenCompleted.reduce((a, b) => a + b, 0) / moodWhenCompleted.length;
            const avgNotCompleted = moodWhenNotCompleted.length > 0 
                ? moodWhenNotCompleted.reduce((a, b) => a + b, 0) / moodWhenNotCompleted.length 
                : null;

            if (avgNotCompleted !== null && Math.abs(avgCompleted - avgNotCompleted) > 0.5) {
                const isPositive = avgCompleted > avgNotCompleted;
                const topMoodValue = moods.find(m => getMoodScore(m.value) === Math.round(avgCompleted))?.value || 'joyful';
                const emoji = getMoodEmoji(topMoodValue);
                
                return {
                    habitName: habit.name,
                    insight: `${emoji} You feel ${isPositive ? 'happier' : 'more down'} on days you complete ${habit.name}`,
                    isPositive
                };
            }
        }
        return null;
    }).filter(Boolean);

    // Weekly Summary Logic
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

    const thisWeekEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const lastWeekEntries = entries.filter(e => {
        const d = new Date(e.date);
        return d >= fourteenDaysAgo && d < sevenDaysAgo;
    });

    const getWeeklyStats = (weekEntries) => {
        if (weekEntries.length === 0) return null;
        const counts = {};
        let totalScore = 0;
        weekEntries.forEach(e => {
            counts[e.mood] = (counts[e.mood] || 0) + 1;
            totalScore += getMoodScore(e.mood);
        });
        const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        const avgScore = totalScore / weekEntries.length;
        return { topMood, avgScore };
    };

    const thisWeekStats = getWeeklyStats(thisWeekEntries);
    const lastWeekStats = getWeeklyStats(lastWeekEntries);

    let weeklySummary = "Keep writing to see your weekly emotional summary!";
    let moodTrend = null;

    if (thisWeekStats) {
        const moodLabel = getMoodLabel(thisWeekStats.topMood);
        const emoji = getMoodEmoji(thisWeekStats.topMood);
        weeklySummary = `This week you felt mostly ${moodLabel} ${emoji}`;
        
        if (lastWeekStats) {
            const diff = thisWeekStats.avgScore - lastWeekStats.avgScore;
            if (diff > 0.2) moodTrend = "Your mood improved compared to last week 📈";
            else if (diff < -0.2) moodTrend = "You've had a tougher week than last one 📉";
            else moodTrend = "Your mood has been steady compared to last week ⚖️";
        }
    }

    // Consistency and Patterns
    const allDays = Object.keys(entriesPerDay).map(d => new Date(d));
    let avgEntriesPerWeek = 0;
    let consistencyScore = 0;
    let bestWritingDay = "N/A";
    let consistencyInsight = "Keep writing to see patterns!";

    if (allDays.length > 0) {
        const firstDate = new Date(Math.min(...allDays));
        const lastDate = new Date(Math.max(...allDays));
        const totalDaysDiff = Math.max(1, Math.ceil((lastDate - firstDate) / 86400000) + 1);
        const totalWeeks = Math.max(1, totalDaysDiff / 7);
        
        avgEntriesPerWeek = (totalEntries / totalWeeks).toFixed(1);
        consistencyScore = Math.round((allDays.length / totalDaysDiff) * 100);

        // Best writing day
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];
        entries.forEach(e => {
            dayCounts[new Date(e.date).getDay()]++;
        });
        const maxDayIdx = dayCounts.indexOf(Math.max(...dayCounts));
        bestWritingDay = dayNames[maxDayIdx];

        // Consistency Insight
        const weekdayEntries = dayCounts.slice(1, 6).reduce((a, b) => a + b, 0);
        const weekendEntries = dayCounts[0] + dayCounts[6];
        if (weekdayEntries > weekendEntries * 2) consistencyInsight = "You write most consistently on weekdays 💼";
        else if (weekendEntries > weekdayEntries) consistencyInsight = "You're a weekend writer! 🌟";
        else consistencyInsight = "You have a balanced writing habit ⚖️";
    }

    // Habit Analytics
    const habitPerformance = habits.map(habit => {
        const completions = habit.completions || [];
        const createdDate = habit.createdAt?.toDate() || sevenDaysAgo;
        const daysSinceCreation = Math.max(1, Math.ceil((now - createdDate) / 86400000));
        const windowDays = Math.min(30, daysSinceCreation);
        
        const windowStart = new Date(now.getTime() - windowDays * 86400000);
        const windowCompletions = completions.filter(d => new Date(d) >= windowStart).length;
        const percentage = Math.round((windowCompletions / windowDays) * 100);

        return {
            id: habit.id,
            name: habit.name,
            percentage,
            completions: completions.length
        };
    });

    const mostConsistentHabit = habitPerformance.length > 0 
        ? [...habitPerformance].sort((a, b) => b.percentage - a.percentage)[0]
        : null;

    // Well-being Score Calculation (0-100)
    // Weights: Consistency (30%), Habits (40%), Mood (30%)
    const avgHabitCompletion = habitPerformance.length > 0
        ? habitPerformance.reduce((acc, h) => acc + h.percentage, 0) / habitPerformance.length
        : 0;
    
    const moodNormalized = thisWeekStats 
        ? ((thisWeekStats.avgScore - 1) / 4) * 100 
        : (Object.values(dailyAvgMood).length > 0 
            ? ((Object.values(dailyAvgMood).reduce((a, b) => a + b, 0) / Object.values(dailyAvgMood).length - 1) / 4) * 100
            : 50);

    const wellBeingScore = Math.round(
        (consistencyScore * 0.3) + 
        (avgHabitCompletion * 0.4) + 
        (moodNormalized * 0.3)
    );

    const wellBeingLevels = [
        { min: 90, label: "Radiant", color: "var(--accent-happy)", emoji: "✨" },
        { min: 70, label: "Balanced", color: "var(--accent-calm)", emoji: "⚖️" },
        { min: 50, label: "Growing", color: "var(--accent-excited)", emoji: "🌱" },
        { min: 0, label: "Recovering", color: "var(--accent-sad)", emoji: "🌊" }
    ];

    const currentLevel = wellBeingLevels.find(l => wellBeingScore >= l.min) || wellBeingLevels[3];

    // Mood Chart Data (Last 14 unique days with entries)
    const moodChartData = Object.keys(dailyAvgMood)
        .sort((a, b) => new Date(a) - new Date(b))
        .slice(-14)
        .map(dateStr => ({
            label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: dailyAvgMood[dateStr]
        }));

    // Smart Messages Logic
    const smartMessages = [];
    
    // 1. Consistency vs Mood
    if (consistencyScore > 70 && thisWeekStats?.avgScore > 3.5) {
        smartMessages.push("✨ You tend to feel better on days you write consistently.");
    }

    // 2. Sleep Correlation (Looking for habits containing "Sleep")
    const sleepHabit = habitPerformance.find(h => h.name.toLowerCase().includes('sleep'));
    if (sleepHabit) {
        const sleepInsight = habitInsights.find(i => i.habitName === sleepHabit.name);
        if (sleepInsight) {
            smartMessages.push(`💤 Your mood ${sleepInsight.isPositive ? 'lifts' : 'drops'} when your ${sleepHabit.name} is ${sleepInsight.isPositive ? 'consistent' : 'low'}.`);
        }
    }

    // 3. Comeback / Recovery Insight
    if (sortedUniqueDays.length >= 2) {
        const latestEntryMs = sortedUniqueDays[0];
        const prevEntryMs = sortedUniqueDays[1];
        const gapDays = Math.round((latestEntryMs - prevEntryMs) / 86400000);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterdayMs = today.getTime() - 86400000;

        // If latest entry is today/yesterday and there was a break of 2+ days
        if (latestEntryMs >= yesterdayMs && gapDays >= 2) {
            smartMessages.push(`🔹 You returned after a ${gapDays} day break — great consistency 🙌`);
        }
    }

    // 4. General Positive Correlation fallback
    if (smartMessages.length < 2 && habitInsights.length > 0) {
        const bestInsight = habitInsights.sort((a, b) => (b.isPositive ? 1 : 0) - (a.isPositive ? 1 : 0))[0];
        if (bestInsight.isPositive) {
            smartMessages.push(`🌟 You're noticeably more positive on days you ${bestInsight.habitName}.`);
        }
    }

    return {
      totalEntries,
      moodCount,
      entriesPerDay,
      mostCommonMood,
      currentStreak,
      longestStreak,
      breakPattern,
      habitInsights,
      weeklySummary,
      moodTrend,
      avgEntriesPerWeek,
      bestWritingDay,
      consistencyScore,
      consistencyInsight,
      moodChartData,
      habitPerformance,
      mostConsistentHabit,
      smartMessages,
      wellBeingScore,
      currentLevel
    };
  }, [entries, habits]);

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
      {/* Header & Smart Insights */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
            📊 Analytics Dashboard
        </h2>

        {analytics.smartMessages.length > 0 && (
            <div className="flex flex-col gap-2">
                {analytics.smartMessages.slice(0, 2).map((msg, i) => (
                    <div key={i} className="px-4 py-2 rounded-xl bg-[var(--accent-happy)]/10 border border-[var(--accent-happy)]/20 text-[var(--accent-happy)] text-sm font-bold animate-in slide-in-from-right-4 duration-500 delay-75">
                        {msg}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* AI Insight Section */}
      {remoteConfig.isAiEnabled && (
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--ui-accent)]/20 shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[var(--ui-accent)]/20 flex items-center justify-center text-sm">✨</span>
                        AI Soul Insight
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] mt-1">Deep analysis of your recent journey</p>
                </div>
                
                {!aiInsight && (
                    <button 
                        onClick={handleGenerateInsight}
                        disabled={isGenerating || entries.length < 2 || hasGeneratedToday}
                        className="px-6 py-3 rounded-2xl bg-[var(--ui-accent)] text-white font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_var(--ui-accent)]/40 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>{hasGeneratedToday ? "Already Generated" : "✨ Generate Insight"}</>
                        )}
                    </button>
                )}
            </div>

            {aiInsight ? (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="prose prose-invert prose-sm max-w-none text-[var(--text-primary)] font-medium leading-relaxed bg-[var(--bg-main)]/30 p-6 rounded-3xl border border-[var(--ui-accent)]/10">
                        <ReactMarkdown>{aiInsight}</ReactMarkdown>
                    </div>
                    <button 
                        onClick={() => setAiInsight(null)}
                        className="mt-4 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
                    >
                        ✕ Clear Insight
                    </button>
                </div>
            ) : !isGenerating && (
                <div className="text-center py-4">
                    <p className="text-sm text-[var(--text-secondary)] italic">
                        Click the button above to have AI analyze your recent entries for patterns and growth.
                    </p>
                </div>
            )}
        </div>
      )}

      {/* 1. 🔥 Insight Card (Well-being & Weekly Summary) */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border-2 border-[var(--accent-happy)]/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-[var(--accent-happy)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-happy)]/20 transition-all duration-700"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="var(--bg-soft)" strokeWidth="10" fill="transparent" />
                            <circle cx="64" cy="64" r="58" stroke="var(--accent-happy)" strokeWidth="10" fill="transparent" 
                                strokeDasharray={364} 
                                strokeDashoffset={364 - (364 * analytics.wellBeingScore) / 100} 
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_var(--accent-happy)]"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-[var(--text-primary)]">{analytics.wellBeingScore}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Score</span>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Well-being Status</h3>
                        </div>
                        <p className="text-4xl font-black" style={{ color: analytics.currentLevel.color }}>
                            {analytics.currentLevel.label} {analytics.currentLevel.emoji}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed max-w-md">
                            Your score is calculated from writing consistency, habit streaks, and emotional trends.
                        </p>
                    </div>
                    <button 
                        onClick={shareWellBeing}
                        className="px-6 py-3 rounded-2xl bg-[var(--accent-happy)] text-[var(--bg-main)] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_var(--accent-happy)]/40 flex items-center gap-2"
                    >
                        Share Progress 🚀
                    </button>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--accent-happy)]/20 shadow-lg relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <span className="text-6xl">📅</span>
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)] mb-3 flex items-center gap-2 uppercase tracking-tighter">
                    Weekly Summary
                </h3>
                <p className="text-xl font-bold text-[var(--text-primary)] leading-tight mb-2">
                    “{analytics.weeklySummary}”
                </p>
                {analytics.moodTrend && (
                    <p className="text-sm text-[var(--accent-happy)] font-bold flex items-center gap-2">
                        {analytics.moodTrend}
                    </p>
                )}
            </div>
        </div>
      </div>

      {/* 2. 📈 Mood Trend Graph */}
      <div className="p-8 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-inner">
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-widest">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent-happy)]/20 flex items-center justify-center text-sm">📈</span>
            Mood Journey
        </h3>
        <MoodChart data={analytics.moodChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. 🧠 Habit vs Mood Insights */}
        <div className="p-8 rounded-[2.5rem] bg-[var(--accent-excited)]/5 border border-[var(--accent-excited)]/20 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-7xl">🧠</span>
            </div>
            <h3 className="text-xl font-black text-[var(--accent-excited)] flex items-center gap-3 uppercase tracking-widest">
                Self-Awareness
            </h3>
            <div className="space-y-4">
                {analytics.habitInsights.length > 0 ? (
                    analytics.habitInsights.map((insight, idx) => (
                        <p key={idx} className="text-[var(--text-primary)] font-medium text-lg leading-relaxed bg-[var(--bg-card)]/50 p-4 rounded-2xl border border-[var(--accent-excited)]/10">
                            {insight.insight}
                        </p>
                    ))
                ) : (
                    <p className="text-[var(--text-secondary)] italic p-4">
                        Keep tracking habits and mood to see correlations here!
                    </p>
                )}
            </div>
        </div>

        {/* 6. 🔁 Streak Section (Moved into grid for balance) */}
        <div className="p-8 rounded-[2.5rem] bg-[var(--accent-happy)]/5 border border-[var(--accent-happy)]/20 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-7xl">🔥</span>
            </div>
            <h3 className="text-xl font-black text-[var(--accent-happy)] flex items-center gap-3 uppercase tracking-widest">
                Streaks
            </h3>
            <div className="bg-[var(--bg-card)]/50 p-6 rounded-[2rem] border border-[var(--accent-happy)]/10 space-y-4">
                <p className="text-[var(--text-primary)] font-medium text-xl leading-relaxed">
                    “You’re on a <span className="text-[var(--accent-happy)] font-black text-2xl">{analytics.currentStreak}-day</span> streak. 
                    Your longest is <span className="text-[var(--accent-happy)] font-bold">{analytics.longestStreak} days</span>!”
                </p>
                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-bold uppercase tracking-tighter">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-sad)]"></span>
                    {analytics.breakPattern}
                </div>
            </div>
        </div>
      </div>

      {/* 4. 📊 Habit Completion Rates */}
      {analytics.habitPerformance.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent-calm)]/20 flex items-center justify-center text-sm">📊</span>
            Habit Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.habitPerformance.map(habit => (
              <div key={habit.id} className="p-6 rounded-[2rem] bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] group hover:border-[var(--accent-happy)]/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-[var(--text-secondary)] uppercase font-black tracking-widest">{habit.name}</p>
                    <p className="text-xl font-black text-[var(--accent-happy)]">{habit.percentage}%</p>
                </div>
                <div className="w-full bg-[var(--bg-soft)] h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-[var(--accent-happy)] h-full transition-all duration-1000" style={{ width: `${habit.percentage}%` }}></div>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">{habit.completions} total completions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ✍️ Writing Stats */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent-excited)]/20 flex items-center justify-center text-sm">✍️</span>
            Writing Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { label: 'Total Entries', value: analytics.totalEntries, color: 'happy' },
                { label: 'Consistency', value: `${analytics.consistencyScore}%`, color: 'calm' },
                { label: 'Avg Per Week', value: analytics.avgEntriesPerWeek, color: 'excited' },
                { label: 'Best Day', value: analytics.bestWritingDay.substring(0, 3), color: 'sad' }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/10 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">
                        {stat.label}
                    </p>
                    <p className={`text-3xl font-black text-[var(--accent-${stat.color})]`}>
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
      </div>

      {/* Mood Distribution (Footer Section) */}
      <div className="pt-8 border-t border-[var(--bg-soft)]">
        <h3 className="text-lg font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6 text-center">
          Mood Distribution
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(analytics.moodCount).map(([mood, count]) => (
            <div key={mood} className="px-6 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] flex items-center gap-3">
                <span className="text-xl">{moods.find(m => m.value === mood)?.emoji}</span>
                <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tighter">{mood}</span>
                <span className="text-xl font-black text-[var(--accent-happy)]">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;