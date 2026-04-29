import { moods, getMoodScore } from '../../constants/moods';

const MoodChart = ({ data = [] }) => {
  if (data.length < 2) return (
    <div className="h-48 flex items-center justify-center border border-dashed border-[var(--bg-soft)] rounded-2xl text-[var(--text-secondary)] italic text-sm">
        Not enough data yet to plot your mood journey...
    </div>
  );

  const width = 800;
  const height = 200;
  const padding = 40;
  
  const moodEmojis = moods.reduce((acc, m) => {
    acc[getMoodScore(m.value)] = m.emoji;
    return acc;
  }, {});

  const maxValue = 5;
  const minValue = 1;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / (data.length - 1));
    const y = height - (padding + ((d.score - minValue) * (height - 2 * padding) / (maxValue - minValue)));
    return { x, y, ...d };
  });

  const linePath = points.reduce((path, p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, ""
  );

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[600px] h-[240px] relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-[0_0_10px_var(--glow-color)]">
                {/* Grid Lines */}
                {[1, 2, 3, 4, 5].map(v => {
                    const y = height - (padding + ((v - minValue) * (height - 2 * padding) / (maxValue - minValue)));
                    return (
                        <g key={v}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--bg-soft)" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-[var(--text-secondary)] font-bold">{moodEmojis[v]}</text>
                        </g>
                    );
                })}

                {/* The Path */}
                <path d={linePath} fill="none" stroke="var(--accent-happy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
                
                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i} className="group/point">
                        <circle cx={p.x} cy={p.y} r="6" fill="var(--bg-card)" stroke="var(--accent-happy)" strokeWidth="3" className="transition-all hover:r-8 cursor-pointer" />
                        <text x={p.x} y={height - 10} textAnchor="middle" className="text-[9px] fill-[var(--text-secondary)] font-bold uppercase tracking-tighter opacity-60">
                            {p.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    </div>
  );
};

export default MoodChart;
