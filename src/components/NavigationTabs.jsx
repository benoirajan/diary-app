const NavigationTabs = ({
    tabs = [],
    activeTab,
    onTabChange,
  }) => {
    return (
      <div className="flex justify-center mb-3">
        <nav className="inline-flex bg-[var(--bg-soft)] p-1.5 rounded-3xl border border-[var(--bg-soft)] shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
  
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`relative px-4 md:px-8 py-2 md:py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-md ring-1 ring-black/5 scale-[1.02]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50"
                }`}
              >
                {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-happy)]"></span>
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };
  
  export default NavigationTabs;