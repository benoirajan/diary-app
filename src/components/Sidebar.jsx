import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Sidebar = ({ 
    tabs, 
    currentView, 
    onTabChange, 
    onFeedback, 
    onInstall,
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
        { 
            label: "Light", 
            value: "light", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
            )
        },
        { 
            label: "Dark", 
            value: "dark", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            )
        },
        { 
            label: "System", 
            value: "system", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
            )
        },
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
                        className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {tabs.map((tab) => {
                    const isActive = (currentView === "detail" ? "list" : currentView) === tab.value;
                    const tourId = tab.value === "habits" ? "nav-habits" : tab.value === "analytics" ? "nav-analytics" : null;
                    return (
                        <button
                            key={tab.value}
                            data-tour={tourId}
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
                            <span className="flex items-center justify-center">{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--bg-soft)] space-y-2">
                {/* Install App Button */}
                {onInstall && (
                    <button
                        onClick={() => {
                            onInstall();
                            if (onClose) onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--accent-main)] bg-[var(--ui-accent-soft)] hover:brightness-110 transition-all mb-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                        <span className="text-sm">Install App</span>
                    </button>
                )}

                {/* Feedback Button */}
                <button
                    onClick={() => {
                        onFeedback();
                        if (onClose) onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    <span className="text-sm">Feedback</span>
                </button>

                {/* Theme Selector */}
                <div className="relative" ref={themeMenuRef}>
                    <button
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center">{currentThemeOption.icon}</span>
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
                                    <span className="flex items-center justify-center">{opt.icon}</span>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
