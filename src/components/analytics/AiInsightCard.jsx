import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isAiEnabled) return null;

  // Helper to truncate markdown safely (rough estimate)
  const truncateMarkdown = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <>
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-soft)] border border-[var(--ui-accent)]/20 shadow-xl relative overflow-hidden group transition-all">
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
                    <div 
                        onClick={() => setIsExpanded(true)}
                        className="prose dark:prose-invert max-w-none cursor-pointer group/content
                            text-[var(--text-secondary)] 
                            prose-headings:text-[var(--text-primary)] 
                            prose-p:text-[var(--text-secondary)]
                            prose-strong:text-[var(--ui-accent)] 
                            prose-li:text-[var(--text-secondary)]
                            prose-a:text-[var(--accent-happy)]
                            prose-blockquote:border-[var(--ui-accent)]
                            font-medium leading-relaxed bg-[var(--bg-main)]/30 p-6 rounded-3xl border border-[var(--ui-accent)]/10 hover:border-[var(--ui-accent)]/30 transition-all"
                    >
                        <ReactMarkdown>{truncateMarkdown(aiInsight)}</ReactMarkdown>
                        <div className="mt-4 text-[10px] text-[var(--ui-accent)] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover/content:translate-x-2 transition-transform">
                            Read Full Insight <span>→</span>
                        </div>
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

        {/* Modal for Full Insight */}
        {isExpanded && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
                <div 
                    className="absolute inset-0 bg-[var(--bg-main)]/90 backdrop-blur-md"
                    onClick={() => setIsExpanded(false)}
                ></div>
                
                <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--ui-accent)]/20 shadow-2xl p-8 sm:p-12 animate-in zoom-in-95 duration-300 custom-scrollbar">
                    <button 
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-8 right-8 w-10 h-10 rounded-full bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:rotate-90 transition-all"
                    >
                        ✕
                    </button>

                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-[var(--ui-accent)]/20 flex items-center justify-center text-lg">✨</span>
                            Soul Insight
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] mt-2">Personalized Reflection for Today</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none 
                        text-[var(--text-secondary)] 
                        prose-headings:text-[var(--text-primary)] 
                        prose-p:text-[var(--text-secondary)]
                        prose-strong:text-[var(--ui-accent)] 
                        prose-li:text-[var(--text-secondary)]
                        prose-a:text-[var(--accent-happy)]
                        prose-blockquote:border-[var(--ui-accent)]
                        font-medium text-lg leading-relaxed">
                        <ReactMarkdown>{aiInsight}</ReactMarkdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--bg-soft)] flex justify-center">
                        <button 
                            onClick={() => setIsExpanded(false)}
                            className="px-8 py-4 rounded-2xl bg-[var(--ui-accent)] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--ui-accent)]/20"
                        >
                            Got it, thanks! ✨
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default AiInsightCard;
