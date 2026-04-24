import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { moodColors, getMoodLabel } from '../constants/moods';
import EntryForm from "./EntryForm";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const EntryDetail = ({
  entry,
  onBack,
  onDelete,
  onUpdate,
  onAnalyze,
  isGeminiLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState("");

  if (!entry) return null;

  const handleUpdate = (updatedData) => {
    onUpdate(entry.id, updatedData);
    setIsEditing(false);
  };

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    const result = await onAnalyze(entry);
    if (result) setAnalysis(result);
  };

  if (isEditing) {
    return (
      <EntryForm 
        initialData={entry}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)] border border-[var(--bg-soft)] transition-all">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all font-bold text-sm"
        >
          <span>←</span> Back to entries
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[var(--bg-soft)] text-[var(--text-primary)] hover:bg-gray-200 transition-all"
          >
            Edit Entry
          </button>

          <button
            onClick={() => {
                if(window.confirm("Are you sure you want to delete this memory?")) {
                    onDelete(entry.id);
                }
            }}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mood Badge */}
        <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${moodColors[entry.mood] || moodColors.neutral}`}>
                {getMoodLabel(entry.mood)}
            </span>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {formatDate(entry.date)}
            </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight">
          {entry.title}
        </h2>

        {/* Content */}
        <article className="prose prose-stone dark:prose-invert max-w-none 
          prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)]
          prose-strong:text-[var(--text-primary)] prose-blockquote:border-[var(--accent-happy)]
          prose-li:text-[var(--text-secondary)] prose-a:text-[var(--accent-happy)]
          leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {entry.content}
            </ReactMarkdown>
        </article>

        {/* AI Analysis Section */}
        {onAnalyze && (
            <div className="mt-12 pt-10 border-t border-[var(--bg-soft)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">AI Insights</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Let AI help you reflect on this entry.</p>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isGeminiLoading}
                        className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                    >
                        {isGeminiLoading ? "✨ Analyzing..." : "✨ Analyze with AI"}
                    </button>
                </div>

                {analysis && (
                    <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 text-[var(--text-primary)] leading-relaxed shadow-inner">
                        <div className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-3">Reflection</div>
                        <div className="whitespace-pre-line italic">"{analysis}"</div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetail;