const WellBeingCard = ({ analytics, onShare }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border-2 border-[var(--accent-happy)]/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[var(--accent-happy)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-happy)]/20 transition-all duration-700"></div>
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="var(--bg-soft)" strokeWidth="10" fill="transparent" />
                        <circle cx="64" cy="64" r="58" stroke="var(--accent-happy)" strokeWidth="10" fill="transparent" 
                            strokeDasharray={364} 
                            strokeDashoffset={364 - (364 * analytics.wellBeingScore) / 100} 
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_var(--accent-happy)]"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-[var(--text-primary)]">{analytics.wellBeingScore}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Score</span>
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Well-being Status</h3>
                    </div>
                    <p className="text-4xl font-black" style={{ color: analytics.currentLevel.color }}>
                        {analytics.currentLevel.label} {analytics.currentLevel.emoji}
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed max-w-md">
                        Your score is calculated from writing consistency, habit streaks, and emotional trends.
                    </p>
                </div>
                <button 
                    onClick={onShare}
                    className="px-6 py-3 rounded-2xl bg-[var(--accent-happy)] text-[var(--bg-main)] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_var(--accent-happy)]/40 flex items-center gap-2"
                >
                    Share Progress 🚀
                </button>
            </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--accent-happy)]/20 shadow-lg relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="text-6xl">📅</span>
            </div>
            <h3 className="text-lg font-black text-[var(--text-primary)] mb-3 flex items-center gap-2 uppercase tracking-tighter">
                Weekly Summary
            </h3>
            <p className="text-xl font-bold text-[var(--text-primary)] leading-tight mb-2">
                “{analytics.weeklySummary}”
            </p>
            {analytics.moodTrend && (
                <p className="text-sm text-[var(--accent-happy)] font-bold flex items-center gap-2">
                    {analytics.moodTrend}
                </p>
            )}
        </div>
    </div>
  );
};

export default WellBeingCard;
