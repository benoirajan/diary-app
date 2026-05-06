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
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm text-xl"
              >
                ☰
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
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm text-xl"
            >
              💬
            </button>
          )}

          {/* Streak View */}
          {streak > 0 && (
            <div 
              className="relative group flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] cursor-pointer transition-all hover:border-[var(--ui-accent)]/50 shadow-sm"
              onClick={() => setShowStreakInfo(!showStreakInfo)}
            >
              <span className="text-lg">🔥</span>
              <span className="font-bold text-[var(--text-primary)]">{streak}</span>
              
              {/* Expanded View on Hover/Click */}
              <div className={`absolute top-full right-0 mt-2 w-40 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-2xl transition-all z-50 text-center 
                ${showStreakInfo ? 'opacity-100 visible scale-100' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100'}`}
              >
                <div className="text-sm font-bold text-[var(--text-primary)] mb-1">🔥 {streak}-day streak</div>
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
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </button>
          )}
        </div>
      </header>
    );
  };
  
  export default Header;
