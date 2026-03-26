import { useMemo } from "react";

const formatGroupDate = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString(); // e.g. Mon Mar 10 2026
};

const moodColors = {
  happy: "bg-[var(--accent-happy)]",
  sad: "bg-[var(--accent-sad)]",
  angry: "bg-[var(--accent-angry)]",
  excited: "bg-[var(--accent-excited)]",
  calm: "bg-[var(--accent-calm)]",
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
    rounded-3xl
    p-8
    shadow-[var(--shadow-soft)]
    border border-[var(--bg-soft)]
    transition-all">
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search your thoughts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)]"
        />
      </div>

      {/* Empty State */}
      {!hasEntries && (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          <div className="text-4xl mb-4">📖</div>
          <p>No entries found. Start writing your story.</p>
        </div>
      )}

      {/* Grouped Entries */}
      {Object.entries(groupedEntries).map(([date, items]) => (
        <div key={date} className="mb-10 last:mb-0">
          {/* Date Header */}
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-6 border-b border-[var(--bg-soft)] pb-3">
            {date}
          </h3>

          <div className="grid gap-6">
            {items.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="group p-6 rounded-2xl bg-[var(--bg-soft)]/30 hover:bg-[var(--bg-soft)] transition-all cursor-pointer border border-transparent hover:border-[var(--accent-happy)]/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-black transition-colors">
                    {entry.title}
                  </h4>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${moodColors[entry.mood] || moodColors.neutral}`}>
                    {entry.mood}
                  </span>
                </div>

                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {truncateText(entry.content, 150)}
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