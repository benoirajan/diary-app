import { useMemo } from "react";
import { moodColors, getMoodEmoji, getMoodLabel } from '../constants/moods';

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
    <div className="p-8  transition-all">
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search your thoughts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full  px-5 py-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--ui-border)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--ui-accent)] outline-none transition-all text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
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
          <div className="absolute left-4 top-8 h-[calc(100%-2.1rem)] w-0.5 bg-[var(--ui-border)]" />
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ui-accent-soft)] border border-[var(--ui-accent)]/20 text-xs font-black text-[var(--ui-accent)]">
              ⚡
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">
              {date}
            </h3>
          </div>

          <div className="space-y-4">
            {items.map((entry) => (
              <article
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="relative group pl-14 pr-5 py-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--ui-border)] shadow-sm hover:shadow-[var(--shadow-soft)] hover:border-[var(--ui-accent)]/50 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                style={{ '--mood-color': `var(--accent-${entry.mood})` }}
              >
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h4 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--ui-accent)] transition-colors">
                    {entry.isLocked ? "🔒 Encrypted Entry" : `${getMoodEmoji(entry.mood)} ${entry.title}`}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${moodColors[entry.mood] || moodColors.neutral}`}>
                      {getMoodLabel(entry.mood)}
                    </span>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                  {entry.isLocked 
                    ? "This entry is encrypted. Please unlock your vault to view the content." 
                    : truncateText(entry.content, 150)}
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