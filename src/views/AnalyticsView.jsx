import { useMemo } from "react";

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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg transition-all space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Analytics
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Entries
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.totalEntries}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Most Common Mood
          </p>
          <p className="text-2xl font-bold text-purple-600 capitalize">
            {analytics.mostCommonMood}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unique Days Written
          </p>
          <p className="text-2xl font-bold text-green-600">
            {Object.keys(analytics.entriesPerDay).length}
          </p>
        </div>
      </div>

      {/* Mood Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Mood Distribution
        </h3>

        {Object.keys(analytics.moodCount).length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No data available.
          </p>
        )}

        <div className="space-y-3">
          {Object.entries(analytics.moodCount).map(
            ([mood, count]) => (
              <div
                key={mood}
                className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <span className="capitalize text-gray-700 dark:text-gray-200">
                  {mood}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
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