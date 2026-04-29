import { moods } from '../../constants/moods';

const MoodDistribution = ({ moodCount }) => {
  return (
    <div className="pt-8 border-t border-[var(--bg-soft)]">
        <h3 className="text-lg font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6 text-center">
          Mood Distribution
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(moodCount).map(([mood, count]) => (
            <div key={mood} className="px-6 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] flex items-center gap-3">
                <span className="text-xl">{moods.find(m => m.value === mood)?.emoji}</span>
                <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tighter">{mood}</span>
                <span className="text-xl font-black text-[var(--accent-happy)]">{count}</span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default MoodDistribution;
