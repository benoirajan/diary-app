import { useMemo } from "react";
import { moods, moodColors } from '../constants/moods';

const AnalyticsView = ({ entries = [] }) => {
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

    return {
      totalEntries,
      moodCount,
      entriesPerDay,
      mostCommonMood,
    };
  }, [entries]);

  return (
    <div className="bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--accent-neutral)]/20 transition-all space-y-8">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
        📊 Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
            Total Entries
          </p>
          <p className="text-4xl font-black text-[var(--accent-happy)] drop-shadow-[0_0_5px_var(--accent-happy)]">
            {analytics.totalEntries}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
            Most Common Mood
          </p>
          <p className="text-4xl font-black text-[var(--accent-excited)] capitalize drop-shadow-[0_0_5px_var(--accent-excited)]">
            {moods.find(m => m.value === analytics.mostCommonMood)?.emoji || '😊'} {analytics.mostCommonMood}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_15px_var(--glow-color)] transition-all">
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
            Unique Days Written
          </p>
          <p className="text-4xl font-black text-[var(--accent-calm)] drop-shadow-[0_0_5px_var(--accent-calm)]">
            {Object.keys(analytics.entriesPerDay).length}
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