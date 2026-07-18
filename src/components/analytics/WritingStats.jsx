const WritingStats = ({ totalEntries, consistencyScore, avgEntriesPerWeek, bestWritingDay }) => {
  const stats = [
    { label: 'Total Entries', value: totalEntries, color: 'happy' },
    { label: 'Consistency', value: `${consistencyScore}%`, color: 'calm' },
    { label: 'Avg Per Week', value: avgEntriesPerWeek, color: 'excited' },
    { label: 'Best Day', value: bestWritingDay.substring(0, 3), color: 'sad' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent-excited)]/20 flex items-center justify-center text-sm">✍️</span>
          Writing Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
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
  );
};

export default WritingStats;
