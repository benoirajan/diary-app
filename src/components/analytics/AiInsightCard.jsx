import ReactMarkdown from 'react-markdown';

const AiInsightCard = ({ 
  isAiEnabled, 
  aiInsight, 
  isGenerating, 
  hasGeneratedToday, 
  onGenerate, 
  onClear, 
  entriesCount 
}) => {
  if (!isAiEnabled) return null;

  return (
    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--ui-accent)]/20 shadow-xl relative overflow-hidden group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
                <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[var(--ui-accent)]/20 flex items-center justify-center text-sm">✨</span>
                    AI Soul Insight
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] mt-1">Deep analysis of your recent journey</p>
            </div>
            
            {!aiInsight && (
                <button 
                    onClick={onGenerate}
                    disabled={isGenerating || entriesCount < 2 || hasGeneratedToday}
                    className="px-6 py-3 rounded-2xl bg-[var(--ui-accent)] text-white font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_var(--ui-accent)]/40 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>{hasGeneratedToday ? "Already Generated" : "✨ Generate Insight"}</>
                    )}
                </button>
            )}
        </div>

        {aiInsight ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="prose prose-invert prose-sm max-w-none text-[var(--text-primary)] font-medium leading-relaxed bg-[var(--bg-main)]/30 p-6 rounded-3xl border border-[var(--ui-accent)]/10">
                    <ReactMarkdown>{aiInsight}</ReactMarkdown>
                </div>
                <button 
                    onClick={onClear}
                    className="mt-4 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
                >
                    ✕ Clear Insight
                </button>
            </div>
        ) : !isGenerating && (
            <div className="text-center py-4">
                <p className="text-sm text-[var(--text-secondary)] italic">
                    Click the button above to have AI analyze your recent entries for patterns and growth.
                </p>
            </div>
        )}
    </div>
  );
};

export default AiInsightCard;
