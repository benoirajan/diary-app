import { useState } from "react";

const moods = [
  { label: "Happy", value: "happy", emoji: "😊" },
  { label: "Sad", value: "sad", emoji: "😔" },
  { label: "Excited", value: "excited", emoji: "🤩" },
  { label: "Angry", value: "angry", emoji: "😡" },
  { label: "Calm", value: "calm", emoji: "😌" },
];

const EntryForm = ({
  onSubmit,
  onGenerateAffirmation,
  isSubmitting = false,
  isGeminiLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("happy");
  const [affirmation, setAffirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title,
      content,
      mood,
      date: new Date().toISOString(),
    });

    // Reset form after submit
    setTitle("");
    setContent("");
    setMood("happy");
    setAffirmation("");
  };

  const handleGenerate = async () => {
    if (!content.trim()) return;

    const result = await onGenerateAffirmation(content, mood);
    if (result) setAffirmation(result);
  };

  return (
    <div className="bg-[var(--bg-card)]
    rounded-2xl
    p-6
    shadow-[var(--shadow-soft)]
    border border-gray-100
    hover:shadow-md
    transition-all">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Create New Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Content */}
        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
          className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        {/* Mood Selector */}
        <div>
          <p className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            Select Mood
          </p>
          <div className="flex gap-3 flex-wrap">
            {moods.map((m) => (
              <button
                type="button"
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  mood === m.value
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Affirmation */}
        {onGenerateAffirmation && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGeminiLoading}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isGeminiLoading ? "Generating..." : "Generate Affirmation"}
            </button>

            {affirmation && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900 text-sm text-gray-700 dark:text-gray-200">
                {affirmation}
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-[var(--bg-soft)]
  text-[var(--text-primary)] font-medium  hover:bg-gray-200 transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  );
};

export default EntryForm;