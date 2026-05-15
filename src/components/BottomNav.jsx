import React from "react";

const BottomNav = ({ currentView, onTabChange }) => {
    const navItems = [
        { 
            label: "Entries", 
            value: "list", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            )
        },
        { 
            label: "Habits", 
            value: "habits", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )
        },
        { 
            label: "Analytics", 
            value: "analytics", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            )
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-[var(--bg-card)]/80 backdrop-blur-xl border-t border-[var(--bg-soft)] px-6 py-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = (currentView === "detail" || currentView === "edit" ? "list" : currentView) === item.value;
                const tourId = item.value === "habits" ? "nav-habits" : item.value === "analytics" ? "nav-analytics" : null;
                return (
                    <button
                        key={item.value}
                        data-tour={tourId}
                        onClick={() => onTabChange(item.value)}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                            isActive 
                                ? "text-[var(--ui-active)] scale-110" 
                                : "text-[var(--text-secondary)] opacity-60 hover:opacity-100"
                        }`}
                    >
                        <div className={`transition-transform duration-300 ${isActive ? "translate-y-[-2px]" : ""}`}>
                            {item.icon}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 h-0 overflow-hidden"}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="w-1 h-1 rounded-full bg-[var(--ui-accent)] animate-glow shadow-[0_0_8px_var(--ui-accent)]"></div>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
