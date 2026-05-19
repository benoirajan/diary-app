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
                            <text x={padding - 12} y={y + 6} textAnchor="end" className="text-base md:text-lg grayscale-0">{moodEmojis[v]}</text>
                        </g>
                    );
                })}

                {/* The Path */}
                <path d={linePath} fill="none" stroke="var(--accent-happy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
                
                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i} className="group/point">
                        {/* Interactive Area */}
                        <circle cx={p.x} cy={p.y} r="15" fill="transparent" className="cursor-pointer" />
                        
                        {/* The Point */}
                        <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="5" 
                            fill="var(--bg-card)" 
                            stroke="var(--accent-happy)" 
                            strokeWidth="3" 
                            className="transition-all duration-300 group-hover/point:r-7 group-hover/point:stroke-width-4 cursor-pointer" 
                        />

                        {/* Hover Tooltip */}
                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <rect 
                                x={p.x - 40} 
                                y={p.y - 45} 
                                width="80" 
                                height="32" 
                                rx="8" 
                                fill="var(--bg-card)" 
                                className="shadow-xl stroke-[var(--accent-happy)]/30 stroke-1"
                            />
                            <text 
                                x={p.x} 
                                y={p.y - 24} 
                                textAnchor="middle" 
                                className="text-sm font-bold fill-[var(--text-primary)]"
                            >
                                {moodEmojis[Math.round(p.score)]} {p.score.toFixed(1)}
                            </text>
                        </g>

                        {/* Date Label */}
                        <text x={p.x} y={height - 5} textAnchor="middle" className="text-[10px] fill-[var(--text-secondary)] font-bold uppercase tracking-tighter opacity-80">
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
