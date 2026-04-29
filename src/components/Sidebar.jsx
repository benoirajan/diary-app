import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Sidebar = ({ 
    tabs, 
    currentView, 
    onTabChange, 
    onFeedback, 
    themeMode, 
    onThemeChange,
    onClose 
}) => {
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const themeMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
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
        <aside className="flex flex-col w-64 h-full bg-[var(--bg-card)] border-r border-[var(--bg-soft)] p-6 z-40">
            <div className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                        SoulScript<span className="text-[var(--ui-accent)]">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1 opacity-50">Digital Soul Journal</p>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        ✕
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {tabs.map((tab) => {
                    const isActive = (currentView === "detail" ? "list" : currentView) === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => {
                                onTabChange(tab.value);
                                if (onClose) onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                                isActive
                                    ? "bg-[var(--ui-accent-soft)] text-[var(--ui-active)] border border-[var(--ui-accent)]/20 shadow-[0_0_15px_rgba(0,0,0,0.02)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]"
                            }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--bg-soft)] space-y-2">
                {/* Feedback Button */}
                <button
                    onClick={() => {
                        onFeedback();
                        if (onClose) onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all"
                >
                    <span className="text-xl">💬</span>
                    <span className="text-sm">Feedback</span>
                </button>

                {/* Theme Selector */}
                <div className="relative" ref={themeMenuRef}>
                    <button
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{currentThemeOption.icon}</span>
                            <span className="text-sm">Theme</span>
                        </div>
                        <span className="text-xs opacity-50">{currentThemeOption.label}</span>
                    </button>

                    {showThemeMenu && (
                        <div className="absolute bottom-full left-0 mb-2 w-full bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
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

                {/* Sign Out Button */}
                <button
                    onClick={() => signOut(auth)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <span className="text-xl">🚪</span>
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
