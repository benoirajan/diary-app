import { useMemo } from "react";
import { moods, moodColors } from '../constants/moods';

const formatGroupDate = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString(); // e.g. Mon Mar 10 2026
};

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
    <div className="bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--accent-neutral)]/20 transition-all">
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search your thoughts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--accent-neutral)]/30 focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
        />
      </div>

      {/* Empty State */}
      {!hasEntries && (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          <div className="text-4xl mb-4">🚀</div>
          <p>No entries found. Start your futuristic journey.</p>
        </div>
      )}

      {/* Grouped Entries */}
      {Object.entries(groupedEntries).map(([date, items]) => (
        <section key={date} className="relative mb-10">
          <div className="absolute left-6 top-6 h-[calc(100%-1.5rem)] w-0.5 bg-gradient-to-b from-[var(--accent-happy)] to-[var(--accent-calm)] shadow-[0_0_10px_var(--glow-color)]" />
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-excited)] to-[var(--accent-happy)] text-xs font-black text-black animate-pulse">
              ⚡
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
              {date}
            </h3>
          </div>

          <div className="space-y-4">
            {items.map((entry) => (
              <article
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="relative group pl-14 pr-5 py-5 rounded-2xl bg-gradient-to-r from-[var(--bg-soft)] to-[var(--bg-card)] border border-[var(--accent-neutral)]/20 shadow-sm hover:shadow-[0_0_20px_var(--glow-color)] hover:border-[var(--mood-color)]/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ '--mood-color': `var(--accent-${entry.mood})` }}
              >


                <div className="flex justify-between items-start mb-2 gap-3">
                  <h4 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--mood-color)] transition-colors drop-shadow-[0_0_3px_var(--glow-color)]">
                    {moods.find(m => m.value === entry.mood)?.emoji || '😊'} {entry.title}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm ${moodColors[entry.mood] || moodColors.neutral} animate-pulse`}>
                    {entry.mood}
                  </span>
                </div>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                  {truncateText(entry.content, 150)}
                </p>

                <small className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider drop-shadow-[0_0_2px_var(--glow-color)]">
                  {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default EntryList;