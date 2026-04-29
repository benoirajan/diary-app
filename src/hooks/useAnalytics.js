import { useMemo } from 'react';
import { moods, getMoodScore, getMoodLabel, getMoodEmoji } from '../constants/moods';

const useAnalytics = (entries = [], habits = []) => {
  return useMemo(() => {
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
};

export default useAnalytics;
