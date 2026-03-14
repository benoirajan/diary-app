import { useState } from "react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const moodColors = {
  happy: "bg-[var(--accent-happy)]",
  sad: "bg-[var(--accent-sad)]",
  angry: "bg-[var(--accent-angry)]",
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
    const result = await onAnalyze(entry);
    if (result) setAnalysis(result);
  };

  return (
    <div className="bg-[var(--bg-card)]
    rounded-2xl
    p-6
    shadow-[var(--shadow-soft)]
    border border-gray-100
    hover:shadow-md
    transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            onClick={() => onDelete(entry.id)}
            className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Title */}
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full mb-3 p-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {editedTitle}
        </h2>
      )}

      {/* Date */}
      <p className={`px-3 py-1 rounded-full text-xs text-white ${moodColors[entry.mood]}`}>
        {formatDate(entry.date)} • Mood: {entry.mood}
      </p>

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none"
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
          {editedContent}
        </p>
      )}

      {/* Save Button (Editing Mode) */}
      {isEditing && (
        <button
          onClick={handleUpdate}
          className="mt-3 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
        >
          Save Changes
        </button>
      )}

      {/* AI Analysis */}
      {onAnalyze && (
        <div className="mt-6 space-y-3">
          <button
            onClick={handleAnalyze}
            disabled={isGeminiLoading}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isGeminiLoading ? "Analyzing..." : "Analyze Entry"}
          </button>

          {analysis && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntryDetail;