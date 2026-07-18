const HabitMoodInsights = ({ insights }) => {
  return (
    <div className="p-8 rounded-[2.5rem] bg-[var(--accent-excited)]/5 border border-[var(--accent-excited)]/20 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-7xl">🧠</span>
        </div>
        <h3 className="text-xl font-black text-[var(--accent-excited)] flex items-center gap-3 uppercase tracking-widest">
            Self-Awareness
        </h3>
        <div className="space-y-4">
            {insights.length > 0 ? (
                insights.map((insight, idx) => (
                    <p key={idx} className="text-[var(--text-primary)] font-medium text-lg leading-relaxed bg-[var(--bg-card)]/50 p-4 rounded-2xl border border-[var(--accent-excited)]/10">
                        {insight.insight}
                    </p>
                ))
            ) : (
                <p className="text-[var(--text-secondary)] italic p-4">
                    Keep tracking habits and mood to see correlations here!
                </p>
            )}
        </div>
    </div>
  );
};

export default HabitMoodInsights;
