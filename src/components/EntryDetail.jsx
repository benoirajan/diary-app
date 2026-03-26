import { useState } from "react";

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

const moodColors = {
  happy: "bg-[var(--accent-happy)]",
  sad: "bg-[var(--accent-sad)]",
  angry: "bg-[var(--accent-angry)]",
  excited: "bg-[var(--accent-excited)]",
  calm: "bg-[var(--accent-calm)]",
  neutral: "bg-[var(--accent-neutral)]",
}

const EntryDetail = ({
  entry,
  onBack,
  onDelete,
  onUpdate,
  onAnalyze,
  isGeminiLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry?.title || "");
  const [editedContent, setEditedContent] = useState(entry?.content || "");
  const [analysis, setAnalysis] = useState("");

  if (!entry) return null;

  const handleUpdate = () => {
    if (!editedTitle.trim() || !editedContent.trim()) return;

    onUpdate(entry.id,{
      title: editedTitle,
      content: editedContent,
    });

    setIsEditing(false);
  };

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    const result = await onAnalyze(entry);
    if (result) setAnalysis(result);
  };

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
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                isEditing 
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                : "bg-[var(--bg-soft)] text-[var(--text-primary)] hover:bg-gray-200"
            }`}
          >
            {isEditing ? "Cancel" : "Edit Entry"}
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
                {entry.mood}
            </span>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {formatDate(entry.date)}
            </span>
        </div>

        {/* Title */}
        {isEditing ? (
            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">Title</label>
                <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-bold text-2xl"
                />
            </div>
        ) : (
            <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight">
            {entry.title}
            </h2>
        )}

        {/* Content */}
        {isEditing ? (
            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">Content</label>
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={10}
                    className="w-full p-5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium resize-none leading-relaxed"
                />
            </div>
        ) : (
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {entry.content}
            </p>
        )}

        {/* Save Button (Editing Mode) */}
        {isEditing && (
            <button
            onClick={handleUpdate}
            className="w-full mt-4 py-4 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-lg hover:opacity-90 transition-all shadow-lg"
            >
            Save Changes
            </button>
        )}

        {/* AI Analysis Section */}
        {!isEditing && onAnalyze && (
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