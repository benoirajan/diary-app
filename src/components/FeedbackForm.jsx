import { useState } from "react";

const FeedbackForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("suggestion"); // suggestion, bug, praise

  const feedbackTypes = [
    { value: "suggestion", label: "💡 Suggestion", color: "bg-blue-500" },
    { value: "bug", label: "🪲 Bug Report", color: "bg-red-500" },
    { value: "praise", label: "💖 Praise", color: "bg-emerald-500" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    onSubmit({
      feedback,
      type,
    });
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-7 border border-[var(--bg-soft)] transition-all">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            Share Feedback<span className="text-[var(--accent-happy)]">.</span>
        </h2>

        {onCancel && (
            <button 
                type="button"
                onClick={onCancel}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
            >
                Cancel
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest">Feedback Type</label>
          <div className="flex gap-2.5 flex-wrap">
            {feedbackTypes.map((t) => {
              const isActive = type === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-xs ${
                    isActive
                      ? `${t.color} text-white border-transparent shadow-md scale-105`
                      : "bg-[var(--bg-soft)] border-transparent text-[var(--text-secondary)] hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Content */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest">Your Message</label>
          <textarea
            placeholder="Tell us what's on your mind... we'd love to hear it!"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            required
            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !feedback.trim()}
            className="w-full py-4 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-base hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-amber-200/30 disabled:opacity-50 mt-1"
          >
            {isSubmitting ? "Submitting..." : "Send Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;