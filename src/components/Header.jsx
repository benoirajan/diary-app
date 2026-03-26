import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header = ({
    title = "My Diary",
    isDarkMode = false,
    onToggleDarkMode,
    onPrimaryAction,
    primaryActionLabel = "",
  }) => {
    return (
      <header className="flex justify-between items-center mb-6 px-2">
        {/* Left Side - Title */}
        <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
          {title}<span className="text-[var(--accent-happy)]">.</span>
        </h1>
  
        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Optional Primary Button */}
          {onPrimaryAction && primaryActionLabel && (
            <button
              onClick={onPrimaryAction}
              className="px-6 py-3 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-bold hover:scale-105 transition-all active:scale-95 shadow-lg shadow-amber-200/40"
            >
              {primaryActionLabel}
            </button>
          )}
  
          <button 
            onClick={() => signOut(auth)}
            className="px-4 py-3 rounded-2xl bg-[var(--bg-soft)] text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-all"
          >
            Sign Out
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--accent-happy)] transition-all shadow-sm text-xl"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </header>
    );
  };
  
  export default Header;