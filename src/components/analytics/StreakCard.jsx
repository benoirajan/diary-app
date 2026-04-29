const StreakCard = ({ currentStreak, longestStreak, breakPattern }) => {
  return (
    <div className="p-8 rounded-[2.5rem] bg-[var(--accent-happy)]/5 border border-[var(--accent-happy)]/20 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-7xl">🔥</span>
        </div>
        <h3 className="text-xl font-black text-[var(--accent-happy)] flex items-center gap-3 uppercase tracking-widest">
            Streaks
        </h3>
        <div className="bg-[var(--bg-card)]/50 p-6 rounded-[2rem] border border-[var(--accent-happy)]/10 space-y-4">
            <p className="text-[var(--text-primary)] font-medium text-xl leading-relaxed">
                “You’re on a <span className="text-[var(--accent-happy)] font-black text-2xl">{currentStreak}-day</span> streak. 
                Your longest is <span className="text-[var(--accent-happy)] font-bold">{longestStreak} days</span>!”
            </p>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-bold uppercase tracking-tighter">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-sad)]"></span>
                {breakPattern}
            </div>
        </div>
    </div>
  );
};

export default StreakCard;
