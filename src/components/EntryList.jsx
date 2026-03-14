import { useMemo } from "react";

const formatGroupDate = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString(); // e.g. Mon Mar 10 2026
};

const moodColors = {
  happy: "bg-[var(--accent-happy)]",
  sad: "bg-[var(--accent-sad)]",
  angry: "bg-[var(--accent-angry)]",
  neutral: "bg-[var(--accent-neutral)]",
}

const truncateText = (text, limit = 120) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

const EntryList = ({
  entries = [],
  searchTerm = "",
  onSearchChange,
  onSelectEntry,
}) => {
  // Group entries by formatted date
  const groupedEntries = useMemo(() => {
    const groups = {};

    entries.forEach((entry) => {
      const groupKey = formatGroupDate(entry.date);

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(entry);
    });

    return groups;
  }, [entries]);

  const hasEntries = entries.length > 0;

  return (
    <div className="bg-[var(--bg-card)]
    rounded-2xl
    p-6
    shadow-[var(--shadow-soft)]
    border border-gray-100
    hover:shadow-md
    transition-all">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Empty State */}
      {!hasEntries && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No entries found.
        </div>
      )}

      {/* Grouped Entries */}
      {Object.entries(groupedEntries).map(([date, items]) => (
        <div key={date} className="mb-8">
          {/* Date Header */}
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2 dark:border-gray-700">
            {date}
          </h3>

          <div className="space-y-4">
            {items.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-md hover:scale-[1.01] transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                    {entry.title}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${moodColors[entry.mood]}`}>
                    {entry.mood}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {truncateText(entry.content)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntryList;