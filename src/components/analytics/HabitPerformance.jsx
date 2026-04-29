const HabitPerformance = ({ performance }) => {
  if (performance.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-[var(--accent-calm)]/20 flex items-center justify-center text-sm">📊</span>
        Habit Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performance.map(habit => (
          <div key={habit.id} className="p-6 rounded-[2rem] bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] group hover:border-[var(--accent-happy)]/50 transition-all">
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-[var(--text-secondary)] uppercase font-black tracking-widest">{habit.name}</p>
                <p className="text-xl font-black text-[var(--accent-happy)]">{habit.percentage}%</p>
            </div>
            <div className="w-full bg-[var(--bg-soft)] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-[var(--accent-happy)] h-full transition-all duration-1000" style={{ width: `${habit.percentage}%` }}></div>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">{habit.completions} total completions</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitPerformance;
