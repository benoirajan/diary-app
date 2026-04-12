import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { moods, moodColors } from '../constants/moods';

const EntryForm = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("happy");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title,
      content,
      mood,
      date: new Date(date).toISOString(),
    });

    // Reset form after submit
    setTitle("");
    setContent("");
    setMood("happy");
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleGenerate = async () => {
    if (!content.trim()) return;
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-7 shadow-[var(--shadow-soft)] border border-[var(--bg-soft)] transition-all">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            Create New Entry<span className="text-[var(--accent-happy)]">.</span>
        </h2>
        
        <button 
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-happy)] transition-colors"
        >
            {isPreview ? "✍️ Edit" : "👁️ Preview"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest">Title</label>
          <input
            type="text"
            placeholder="How was your day?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm"
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Your Story</label>
            <span className="text-[10px] text-[var(--text-secondary)] opacity-50 italic">Markdown supported</span>
          </div>
          
          {isPreview ? (
            <div className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)]/50 min-h-[160px] border border-dashed border-[var(--bg-soft)]">
                <article className="prose prose-sm prose-stone dark:prose-invert max-w-none 
                    prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)]
                    prose-strong:text-[var(--text-primary)] prose-blockquote:border-[var(--accent-happy)]
                    prose-li:text-[var(--text-secondary)] prose-a:text-[var(--accent-happy)]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || "*No content to preview...*"}
                    </ReactMarkdown>
                </article>
            </div>
          ) : (
            <textarea
              placeholder="Write your thoughts here... (e.g. # Hello World)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm resize-none leading-relaxed"
            />
          )}
        </div>

        {/* Date Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm"
          />
        </div>

        {/* Mood Selector */}

        <div className="pt-2 flex flex-col gap-3">
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-base hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-amber-200/30 disabled:opacity-50 mt-1"
          >
            {isSubmitting ? "Saving to your diary..." : <><span className="hidden sm:inline">Save Entry</span><span className="sm:hidden">Save</span></>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;