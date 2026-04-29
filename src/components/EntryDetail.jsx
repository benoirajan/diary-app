import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { moodColors, getMoodLabel, getMoodEmoji } from '../constants/moods';
import EntryForm from "./EntryForm";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EntryDetail = ({
  entry,
  onBack,
  onDelete,
  onUpdate
}) => {
  const { confirm } = useModal();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  if (!entry) return null;

  const handleUpdate = (updatedData) => {
    onUpdate(entry.id, updatedData);
    setIsEditing(false);
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
    <div className="max-w-4xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-10">
            <button
                onClick={onBack}
                className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all font-black text-[10px] uppercase tracking-widest"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to entries
            </button>

            <div className="flex gap-4">
                <button
                    onClick={async () => {
                        const confirmed = await confirm({
                            title: "Alter the Past?",
                            message: "Journaling is a witness to your truth. Are you sure you want to rewrite this moment of your history?",
                            confirmText: "Edit Reality",
                            cancelText: "Keep Truth",
                            type: "info"
                        });
                        if (confirmed) setIsEditing(true);
                    }}
                    className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[var(--bg-soft)] text-[var(--text-primary)] border border-[var(--ui-border)] hover:border-[var(--ui-accent)]/50 hover:bg-[var(--bg-card)] transition-all"
                >
                    Edit
                </button>

                <button
                    onClick={async () => {
                        const confirmed = await confirm({
                            title: "Delete Memory?",
                            message: "Are you sure you want to permanently delete this memory? This action cannot be undone.",
                            confirmText: "Delete",
                            type: "danger"
                        });

                        if (confirmed) {
                            try {
                                onDelete(entry.id);
                                showToast("Memory deleted successfully");
                            } catch {
                                showToast("Failed to delete memory", "error");
                            }
                        }
                    }}
                    className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                    Delete
                </button>
            </div>
        </div>

        {/* Entry Card */}
        <div className="bg-[var(--bg-card)] rounded-[3rem] shadow-2xl border border-[var(--bg-soft)] relative overflow-hidden">
            {/* Aesthetic Background Glow */}
            <div 
                className="absolute top-0 right-0 w-96 h-96 bg-[var(--mood-color)] opacity-[0.05] blur-[120px] -mr-48 -mt-48 rounded-full pointer-events-none"
                style={{ '--mood-color': `var(--accent-${entry.mood})` }}
            />
            
            {/* Vertical Margin line (Analog Journal feel) */}
            <div className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--ui-accent)]/20 to-transparent hidden sm:block" />

            <div className="relative p-8 md:p-20 md:pl-32 space-y-12">
                {/* Header Section as a "Date Stamp" */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-[var(--ui-accent)] uppercase tracking-[0.4em] opacity-80">
                            Entry Logged
                        </div>
                        <div className="flex items-baseline gap-4">
                            <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter">
                                {formatDate(entry.date)}
                            </h3>
                            <span className="text-sm font-bold text-[var(--text-secondary)] opacity-40">
                                {formatTime(entry.date)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${moodColors[entry.mood] || moodColors.neutral} shadow-[var(--mood-color)]/20`}
                             style={{ '--mood-color': `var(--accent-${entry.mood})` }}>
                            <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                            {getMoodLabel(entry.mood)}
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-[var(--bg-soft)] to-transparent" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] leading-[1.2] tracking-tight">
                        {entry.isLocked ? "🔒 Encrypted Entry" : entry.title}
                    </h2>
                </div>

                {/* Content Section */}
                <article className="prose dark:prose-invert max-w-none 
                    text-[var(--text-secondary)] text-lg md:text-xl font-medium leading-relaxed
                    prose-headings:text-[var(--text-primary)] prose-headings:font-black prose-headings:tracking-tight
                    prose-p:text-[var(--text-secondary)] prose-p:mb-8
                    prose-strong:text-[var(--text-primary)] prose-strong:font-black
                    prose-blockquote:border-l-4 prose-blockquote:border-[var(--ui-accent)] prose-blockquote:bg-[var(--bg-soft)]/20 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic
                    prose-li:text-[var(--text-secondary)] 
                    prose-a:text-[var(--ui-accent)] prose-a:underline prose-a:decoration-[var(--ui-accent)]/30
                    prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
                    {entry.isLocked ? (
                        <div className="py-20 bg-[var(--bg-soft)]/30 rounded-[3rem] border-2 border-dashed border-[var(--ui-border)] text-center space-y-6">
                            <div className="w-20 h-20 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto shadow-xl">
                                <span className="text-3xl">🔒</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[var(--text-primary)] text-xl font-black uppercase tracking-widest">
                                    Encrypted Core
                                </p>
                                <p className="text-[var(--text-secondary)] max-w-xs mx-auto text-sm leading-relaxed">
                                    This reflection is protected by your local vault key. Unlock to restore readability.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {entry.content}
                        </ReactMarkdown>
                    )}
                </article>

                {/* Closing Signature / Metadata */}
                <div className="pt-16 border-t border-[var(--bg-soft)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--text-muted)]">Reflection Identifier</div>
                        <div className="text-[10px] font-mono text-[var(--text-secondary)] opacity-50">SOULSCRIPT-{entry.id?.substring(0,8).toUpperCase() || 'UNSET'}</div>
                    </div>
                    
                    <div className="flex items-center gap-4 py-2 px-6 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--ui-border)]">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-2 h-2 rounded-full bg-[var(--ui-accent)] opacity-20" />
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">End of Entry</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EntryDetail;
