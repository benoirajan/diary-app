import { useMemo } from "react";
import { moods, moodColors } from '../constants/moods';
import useHabits from "../hooks/useHabits";

const MoodChart = ({ data = [] }) => {
  if (data.length < 2) return (
    <div className="h-48 flex items-center justify-center border border-dashed border-[var(--bg-soft)] rounded-2xl text-[var(--text-secondary)] italic text-sm">
        Not enough data yet to plot your mood journey...
    </div>
  );

  const width = 800;
  const height = 200;
  const padding = 40;
  
  const moodScores = { excited: 5, happy: 4, calm: 3, sad: 2, angry: 1 };
  const moodEmojis = { 5: "🤩", 4: "😊", 3: "😌", 2: "😔", 1: "😡" };

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
    const moodScores = { excited: 5, happy: 4, calm: 3, sad: 2, angry: 1 };
    const dailyAvgMood = {};
    entries.forEach(entry => {
        const dateKey = new Date(entry.date).toDateString();
        if (!dailyAvgMood[dateKey]) dailyAvgMood[dateKey] = [];
        dailyAvgMood[dateKey].push(moodScores[entry.mood] || 3);
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
                const topMoodValue = Object.entries(moodScores).find(([_, score]) => score === Math.round(avgCompleted))?.[0] || 'happy';
                const emoji = moods.find(m => m.value === topMoodValue)?.emoji || '😊';
                
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
            totalScore += moodScores[e.mood] || 3;
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
        const moodObj = moods.find(m => m.value === thisWeekStats.topMood);
        weeklySummary = `This week you felt mostly ${thisWeekStats.topMood} ${moodObj?.emoji || '😊'}`;
        
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
    <div className="bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--accent-neutral)]/20 transition-all space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
            📊 Analytics Dashboard
        </h2>

        {/* Smart Insights Banner */}
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

      {/* Well-being Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border-2 border-[var(--accent-happy)]/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[var(--accent-happy)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-happy)]/20 transition-all duration-700"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Circular Score Visual */}
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
                        <span className="px-3 py-1 rounded-full bg-[var(--bg-soft)] text-[var(--accent-happy)] text-xs font-bold border border-[var(--accent-happy)]/20">BETA</span>
                    </div>
                    <p className="text-4xl font-black transition-all" style={{ color: analytics.currentLevel.color }}>
                        {analytics.currentLevel.label} {analytics.currentLevel.emoji}
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed max-w-md">
                        Your score is calculated from writing consistency, habit streaks, and emotional trends. Keep it up!
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

        {/* Quick Stats Helper */}
        <div className="p-8 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--bg-soft)] flex flex-col justify-center space-y-4 shadow-inner">
            <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] uppercase">
                    <span>Consistency</span>
                    <span>{analytics.consistencyScore}%</span>
                </div>
                <div className="w-full bg-[var(--bg-soft)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent-calm)] h-full" style={{ width: `${analytics.consistencyScore}%` }}></div>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] uppercase">
                    <span>Mood Trend</span>
                    <span>{Math.round(analytics.moodNormalized || 50)}%</span>
                </div>
                <div className="w-full bg-[var(--bg-soft)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent-excited)] h-full" style={{ width: `${analytics.moodNormalized || 50}%` }}></div>
                </div>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] italic text-center">
                Refining your inner glow, day by day.
            </p>
        </div>
      </div>

      {/* Mood Over Time Chart */}
      <div className="p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-inner">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            Mood Journey <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-[var(--bg-soft)] text-[var(--text-secondary)]">Trends</span>
        </h3>
        <MoodChart data={analytics.moodChartData} />
      </div>

      {/* Weekly Summary Card */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--accent-happy)]/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
            <span className="text-7xl">📅</span>
        </div>
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
            Weekly Summary <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-[var(--bg-soft)] text-[var(--text-secondary)]">Insights</span>
        </h3>
        <div className="space-y-3">
            <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
                “{analytics.weeklySummary}”
            </p>
            <div className="flex flex-col gap-1">
                {analytics.moodTrend && (
                    <p className="text-lg text-[var(--accent-happy)] font-semibold flex items-center gap-2">
                        {analytics.moodTrend}
                    </p>
                )}
                <div className="space-y-1">
                    <p className="text-sm text-[var(--text-secondary)] font-medium italic">
                        💡 {analytics.consistencyInsight}
                    </p>
                    {analytics.mostConsistentHabit && (
                        <p className="text-sm text-[var(--text-secondary)] font-medium italic">
                            🏆 You are most consistent with <span className="text-[var(--accent-happy)] font-bold">{analytics.mostConsistentHabit.name}</span> {analytics.mostConsistentHabit.percentage > 80 ? '🙏' : '✨'}
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Motivational Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--accent-happy)]/10 border border-[var(--accent-happy)]/30 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="text-6xl">🔥</span>
            </div>
            <h3 className="text-xl font-black text-[var(--accent-happy)] flex items-center gap-2">
                Streaks <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-[var(--accent-happy)]/20 text-[var(--accent-happy)]">Motivational</span>
            </h3>
            <p className="text-[var(--text-primary)] font-medium text-lg leading-relaxed">
                “You’re on a <span className="text-[var(--accent-happy)] font-bold">{analytics.currentStreak}-day</span> streak. 
                Your longest is <span className="text-[var(--accent-happy)] font-bold">{analytics.longestStreak} days</span> 
                {analytics.currentStreak >= analytics.longestStreak && analytics.currentStreak > 0 ? " — You're at your best!" : " — almost there."}”
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-semibold italic">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-sad)]"></span>
                📉 {analytics.breakPattern}
            </div>
        </div>

        {/* Habit-Mood Correlation Insights */}
        <div className="p-6 rounded-3xl bg-[var(--accent-excited)]/10 border border-[var(--accent-excited)]/30 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="text-6xl">🧠</span>
            </div>
            <h3 className="text-xl font-black text-[var(--accent-excited)] flex items-center gap-2">
                Self-Awareness <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-[var(--accent-excited)]/20 text-[var(--accent-excited)]">AI Insights</span>
            </h3>
            <div className="space-y-3">
                {analytics.habitInsights.length > 0 ? (
                    analytics.habitInsights.map((insight, idx) => (
                        <p key={idx} className="text-[var(--text-primary)] font-medium text-lg leading-relaxed">
                            {insight.insight}
                        </p>
                    ))
                ) : (
                    <p className="text-[var(--text-secondary)] italic">
                        Keep tracking habits and mood to see correlations here!
                    </p>
                )}
            </div>
        </div>
      </div>

      {/* Habit Performance */}
      {analytics.habitPerformance.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_3px_var(--glow-color)]">
            Habit Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.habitPerformance.map(habit => (
              <div key={habit.id} className="p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)] group hover:border-[var(--accent-happy)]/50 transition-all">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-[var(--text-secondary)] uppercase font-bold">{habit.name}</p>
                    <p className="text-lg font-black text-[var(--accent-happy)]">{habit.percentage}%</p>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mb-2">{habit.completions} total completions</p>
                <div className="w-full bg-[var(--bg-soft)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent-happy)] h-full transition-all duration-1000" style={{ width: `${habit.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
            Total Entries
          </p>
          <p className="text-3xl font-black text-[var(--accent-happy)] drop-shadow-[0_0_5px_var(--accent-happy)]">
            {analytics.totalEntries}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
            Consistency
          </p>
          <p className="text-3xl font-black text-[var(--accent-calm)] drop-shadow-[0_0_5px_var(--accent-calm)]">
            {analytics.consistencyScore}%
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
            Avg Per Week
          </p>
          <p className="text-3xl font-black text-[var(--accent-excited)] drop-shadow-[0_0_5px_var(--accent-excited)]">
            {analytics.avgEntriesPerWeek}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
            Best Day
          </p>
          <p className="text-3xl font-black text-[var(--accent-sad)] drop-shadow-[0_0_5px_var(--accent-sad)]">
            {analytics.bestWritingDay.substring(0, 3)}
          </p>
        </div>
      </div>

      {/* Mood Distribution */}
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_3px_var(--glow-color)] mb-4">
          Mood Distribution
        </h3>

        {Object.keys(analytics.moodCount).length === 0 && (
          <p className="text-[var(--text-secondary)]">
            No data available. Start writing to see your mood patterns!
          </p>
        )}

        <div className="space-y-4">
          {Object.entries(analytics.moodCount).map(
            ([mood, count]) => (
              <div
                key={mood}
                className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_10px_var(--glow-color)] transition-all"
                style={{ '--mood-color': `var(--accent-${mood})` }}
              >
                <span className="capitalize text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  {moods.find(m => m.value === mood)?.emoji || '😊'} {mood}
                </span>
                <span className="font-black text-2xl text-[var(--mood-color)] drop-shadow-[0_0_3px_var(--mood-color)]">
                  {count}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;