import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { moods, moodColors, getMoodEmoji, getMoodLabel } from '../constants/moods';
import { discoverMood } from '../services/aiService';
import { useSecurity } from '../context/SecurityContext';
import { useToast } from '../context/ToastContext';
import { useRemoteConfig } from '../context/RemoteConfigContext';

const EntryForm = ({
  onSubmit,
  initialData = null,
  onCancel = null,
  isSubmitting = false,
}) => {
  const { encryptAll } = useSecurity();
  const { showToast } = useToast();
  const { config: remoteConfig } = useRemoteConfig();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [mood, setMood] = useState(initialData?.mood || "peaceful");
  const [isEncrypted, setIsEncrypted] = useState(initialData?.isEncrypted || encryptAll);
  
  // Sync with global setting if it changes or when creating new
  useEffect(() => {
    if (!initialData && encryptAll) {
        setIsEncrypted(true);
    }
  }, [encryptAll, initialData]);

  const [date, setDate] = useState(
    initialData?.date 
      ? new Date(initialData.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(
    initialData?.date
      ? new Date(initialData.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // AI Mood Discovery State
  const [suggestedMood, setSuggestedMood] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceTimer = useRef(null);

  // Effect for automatic mood discovery
  useEffect(() => {
    // Only analyze if AI is enabled, content is long enough and not just whitespace
    if (!remoteConfig.isAiEnabled || content.trim().length < 30) {
      setSuggestedMood(null);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer for 2.5 seconds
    debounceTimer.current = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const discovered = await discoverMood(content);
        if (discovered) {
          setSuggestedMood(discovered);
          setMood(discovered); // AI automatically selects the mood
        } else {
          showToast("AI couldn't analyze your mood. Try writing a bit more!", "error");
        }
      } catch {
        showToast("AI Mood analysis failed. Please check your connection.", "error");
      } finally {
        setIsAnalyzing(false);
      }
    }, 2500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [content, remoteConfig.isAiEnabled, showToast]);

  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition is not supported in this browser.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    // Combine date and time
    const combinedDateTime = new Date(`${date}T${time}`);

    onSubmit({
      title,
      content,
      mood,
      isEncrypted,
      date: combinedDateTime.toISOString(),
    });

    if (!initialData) {
      // Reset form after submit ONLY if it's a new entry
      setTitle("");
      setContent("");
      setMood("peaceful");
      setSuggestedMood(null);
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-7  border border-[var(--bg-soft)] transition-all">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            {initialData ? "Edit Entry" : "Create New Entry"}<span className="text-[var(--accent-happy)]">.</span>
        </h2>

        <div className="flex gap-4 items-center">
            {onCancel && (
                <button 
                    type="button"
                    onClick={onCancel}
                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                    Cancel
                </button>
            )}
            <button 
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-happy)] transition-colors"
            >
                {isPreview ? "✍️ Edit" : "👁️ Preview"}
            </button>
        </div>
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
            <div className="flex items-center gap-3">
                <button 
                    type="button"
                    onClick={startVoiceRecording}
                    disabled={isPreview || isRecording}
                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isRecording 
                            ? "text-red-500 animate-pulse" 
                            : "text-[var(--text-secondary)] hover:text-[var(--accent-happy)]"
                    } disabled:opacity-30`}
                >
                    {isRecording ? "🔴 Listening..." : "🎙️ Voice to Text"}
                </button>
                <span className="text-[10px] text-[var(--text-secondary)] opacity-50 italic">Markdown supported</span>
            </div>
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

        {/* Date & Time Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm"
            />
          </div>
        </div>

        {/* Encryption Toggle */}
        <div className="flex items-center justify-between px-2 py-3 bg-[var(--bg-soft)]/50 rounded-2xl border border-[var(--bg-soft)]">
            <div className="flex items-center gap-3">
                <span className="text-xl">{isEncrypted ? "🔒" : "🔓"}</span>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Encrypt this entry</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                        {encryptAll ? "Forced by global settings" : "Protect with your private vault key"}
                    </span>
                </div>
            </div>
            <button
                type="button"
                disabled={encryptAll}
                onClick={() => setIsEncrypted(!isEncrypted)}
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${
                    isEncrypted ? 'bg-[var(--ui-accent)]' : 'bg-gray-600'
                } ${encryptAll ? 'opacity-50' : ''}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEncrypted ? 'translate-x-5' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>

        {/* Mood Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">How do you feel?</label>
            {isAnalyzing && (
              <span className="text-[10px] font-bold text-[var(--accent-main)] animate-pulse uppercase tracking-widest">
                ✨ Discovering Mood...
              </span>
            )}
            {!isAnalyzing && suggestedMood && (
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest flex items-center gap-1">
                ✨ AI thinks you feel {getMoodLabel(suggestedMood)} {getMoodEmoji(suggestedMood)}
              </span>
            )}
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {moods.map((m) => {
              const isActive = mood === m.value;
              const isSuggested = suggestedMood === m.value;
              return (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-xs ${
                    isActive
                      ? `${moodColors[m.value]} text-[var(--text-inverted)] border-transparent shadow-md scale-105`
                      : isSuggested
                        ? "bg-[var(--bg-soft)] border-[var(--accent-main)] text-[var(--text-primary)] animate-glow"
                        : "bg-[var(--bg-soft)] border-transparent text-[var(--text-secondary)] hover:bg-gray-200"
                  }`}
                >
                  <span className="text-base">{m.emoji}</span> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-base hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-amber-200/30 disabled:opacity-50 mt-1"
          >
            {isSubmitting 
                ? "Saving..." 
                : initialData 
                    ? "Update Entry" 
                    : <><span className="hidden sm:inline">Save Entry</span><span className="sm:hidden">Save</span></>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;