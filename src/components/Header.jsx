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
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
          {title}<span className="text-[var(--accent-happy)]">.</span>
        </h1>
  
        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
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