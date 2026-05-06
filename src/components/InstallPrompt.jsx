import React from "react";

const InstallPrompt = ({ onInstall, onDismiss }) => {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md animate-in slide-in-from-top-10 duration-500">
            <div className="bg-[var(--bg-card)]/80 backdrop-blur-2xl border border-[var(--ui-accent)]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--ui-accent-soft)] flex items-center justify-center text-3xl shadow-inner">
                        📲
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                            Install SoulScript
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
                            Add SoulScript to your home screen for a faster, full-screen experience.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onInstall}
                        className="flex-1 py-3.5 rounded-2xl bg-[var(--accent-main)] text-black font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--accent-main)]/20"
                    >
                        Install Now
                    </button>
                    <button
                        onClick={onDismiss}
                        className="px-6 py-3.5 rounded-2xl bg-[var(--bg-soft)] text-[var(--text-secondary)] font-bold text-sm hover:text-[var(--text-primary)] transition-all"
                    >
                        Later
                    </button>
                </div>
                
                {/* Decorative Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--ui-accent)]/20 to-transparent rounded-[inherit] -z-10 blur-xl opacity-50"></div>
            </div>
        </div>
    );
};

export default InstallPrompt;
