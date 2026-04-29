import Header from "./Header";

const Sidebar = ({ 
    tabs, 
    currentView, 
    onTabChange, 
    onFeedback, 
    themeMode, 
    onThemeChange,
    onClose 
}) => {
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

            <div className="mt-auto pt-6 border-t border-[var(--bg-soft)] space-y-4">
                <Header 
                    themeMode={themeMode}
                    onThemeChange={onThemeChange}
                    onFeedback={onFeedback}
                    hideTitle={true}
                    hideFeedback={false}
                    hideSignOut={false}
                    isSidebar={true}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
