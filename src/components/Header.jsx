import { useState } from "react";

const Header = ({
    hideTitle = false,
    hideFeedback = false,
    onPrimaryAction,
    onFeedback,
    primaryActionLabel = "",
    streak = 0,
    onMenuClick,
    showMenuButton = false,
  }) => {
    const [showStreakInfo, setShowStreakInfo] = useState(false);

    return (
      <header className={`flex justify-between items-center px-2 ${hideTitle ? 'justify-end' : ''} mb-6`}>
        {/* Left Side - Title & Menu */}
        {!hideTitle && (
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm text-[var(--text-primary)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              SoulScript<span className="text-[var(--ui-accent)]">.</span>
            </h1>
          </div>
        )}
  
        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Feedback Button */}
          {!hideFeedback && onFeedback && (
            <button
              onClick={onFeedback}
              title="Share Feedback"
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm text-[var(--text-primary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </button>
          )}

          {/* Streak View */}
          {streak > 0 && (
            <div 
              className="relative group flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] cursor-pointer transition-all hover:border-[var(--ui-accent)]/50 shadow-sm"
              onClick={() => setShowStreakInfo(!showStreakInfo)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-1.333-2.98 3.75 3.75 0 0 0 2.763 6.901Z" />
              </svg>
              <span className="font-bold text-[var(--text-primary)]">{streak}</span>
              
              {/* Expanded View on Hover/Click */}
              <div className={`absolute top-full right-0 mt-2 w-40 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-2xl transition-all z-50 text-center 
                ${showStreakInfo ? 'opacity-100 visible scale-100' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100'}`}
              >
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-[var(--text-primary)] mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-1.333-2.98 3.75 3.75 0 0 0 2.763 6.901Z" />
                  </svg>
                  <span>{streak}-day streak</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">“You’re doing great”</div>
                <div className="absolute -top-1 right-5 w-2 h-2 bg-[var(--bg-card)] border-t border-l border-[var(--bg-soft)] rotate-45"></div>
              </div>
            </div>
          )}

          {/* Optional Primary Button */}
          {onPrimaryAction && primaryActionLabel && (
            <button
              onClick={onPrimaryAction}
              className="px-4 md:px-6 py-3 rounded-2xl bg-[var(--ui-accent)] text-white font-bold hover:scale-105 transition-all active:scale-95 shadow-lg shadow-[var(--ui-accent)]/20 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </button>
          )}
        </div>
      </header>
    );
  };
  
  export default Header;
