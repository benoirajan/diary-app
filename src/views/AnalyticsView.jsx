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

    // Mood Chart Data (Last 14 unique days with entries)
    const moodChartData = Object.keys(dailyAvgMood)
        .sort((a, b) => new Date(a) - new Date(b))
        .slice(-14)
        .map(dateStr => ({
            label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: dailyAvgMood[dateStr]
        }));

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
      moodChartData
    };
  }, [entries, habits]);

  return (
    <div className="bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--accent-neutral)]/20 transition-all space-y-8">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
        📊 Analytics Dashboard
      </h2>

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
                <p className="text-sm text-[var(--text-secondary)] font-medium italic">
                    💡 {analytics.consistencyInsight}
                </p>
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

      {/* Habit Highlights */}
      {habits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_3px_var(--glow-color)]">
            Habit Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map(habit => (
              <div key={habit.id} className="p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)]">
                <p className="text-xs text-[var(--text-secondary)] uppercase font-bold">{habit.name}</p>
                <p className="text-2xl font-black text-[var(--accent-happy)]">{habit.completions?.length || 0} days</p>
                <div className="w-full bg-[var(--bg-soft)] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[var(--accent-happy)] h-full" style={{ width: `${Math.min(100, ((habit.completions?.length || 0) / 30) * 100)}%` }}></div>
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