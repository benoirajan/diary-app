import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header = ({
    themeMode = "system",
    onThemeChange,
    hideTitle = false,
    hideToggle = false,
    hideFeedback = false,
    hideSignOut = false,
    onPrimaryAction,
    onFeedback,
    primaryActionLabel = "",
    streak = 0,
    isSidebar = false,
    onMenuClick,
    showMenuButton = false,
  }) => {
    const [showStreakInfo, setShowStreakInfo] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowThemeMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const themeOptions = [
        { label: "Light", value: "light", icon: "☀️" },
        { label: "Dark", value: "dark", icon: "🌙" },
        { label: "System", value: "system", icon: "💻" },
    ];

    const currentThemeOption = themeOptions.find(opt => opt.value === themeMode) || themeOptions[2];

    return (
      <header className={`flex justify-between items-center px-2 ${hideTitle ? 'justify-end' : ''} ${isSidebar ? 'w-full mb-0' : 'mb-6'}`}>
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
        <div className={`flex items-center gap-3 ${isSidebar ? 'w-full justify-between' : ''}`}>
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
  
          {!hideSignOut && (
            <button 
                onClick={() => signOut(auth)}
                className="px-4 py-3 rounded-2xl bg-[var(--bg-soft)] text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-all"
            >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
            </button>
          )}

          {/* Theme Selector Menu */}
          {!hideToggle && (
            <div className={`relative ${isSidebar ? 'flex-1' : ''}`} ref={menuRef}>
                <button
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className={`h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm ${isSidebar ? 'w-full px-4 justify-between' : 'w-12 text-xl'}`}
                    title={`Current: ${currentThemeOption.label}`}
                >
                    {isSidebar && (
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight">Theme</span>
                    )}
                    <span className="text-xl">{currentThemeOption.icon}</span>
                </button>

                {showThemeMenu && (
                    <div className={`absolute z-[100] mt-2 w-36 bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 
                        ${isSidebar ? 'bottom-full left-0 mb-2' : 'top-full right-0'}`}
                    >
                        {themeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onThemeChange(opt.value);
                                    setShowThemeMenu(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    themeMode === opt.value
                                        ? "bg-[var(--ui-accent-soft)] text-[var(--ui-active)]"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]"
                                }`}
                            >
                                <span className="text-lg">{opt.icon}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          )}
        </div>
      </header>
    );
  };
  
  export default Header;
