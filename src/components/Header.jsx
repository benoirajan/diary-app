import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header = ({
    isDarkMode = false,
    hideTitle = false,
    hideToggle = false,
    onToggleDarkMode,
    onPrimaryAction,
    onFeedback,
    primaryActionLabel = "",
    streak = 0,
  }) => {
    return (
      <header className={`flex justify-between items-center mb-6 px-2 ${hideTitle ? 'justify-end' : ''}`}>
        {/* Left Side - Title */}
        {!hideTitle && (
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            SoulScript<span className="text-[var(--accent-happy)]">.</span>
          </h1>
        )}
  
        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Feedback Button */}
          {onFeedback && (
            <button
              onClick={onFeedback}
              title="Share Feedback"
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--accent-happy)] transition-all shadow-sm text-xl"
            >
              💬
            </button>
          )}

          {/* Streak View */}
          {streak > 0 && (
            <div className="relative group flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] cursor-default transition-all hover:border-[var(--accent-happy)]/50 shadow-sm">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-[var(--text-primary)]">{streak}</span>
              
              {/* Expanded View on Hover */}
              <div className="absolute top-full right-0 mt-2 w-40 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center scale-95 group-hover:scale-100">
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
              className="px-4 md:px-6 py-3 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-bold hover:scale-105 transition-all active:scale-95 shadow-lg shadow-amber-200/40 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </button>
          )}
  
          <button 
            onClick={() => signOut(auth)}
            className="px-4 py-3 rounded-2xl bg-[var(--bg-soft)] text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-all"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </button>

          {/* Dark Mode Toggle */}
          {!hideToggle && (
            <button
              onClick={onToggleDarkMode}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--accent-happy)] transition-all shadow-sm text-xl"
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>
          )}
        </div>
      </header>
    );
  };
  
  export default Header;