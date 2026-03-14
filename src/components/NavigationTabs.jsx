const NavigationTabs = ({
    tabs = [],
    activeTab,
    onTabChange,
  }) => {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-sm px-6 py-3 transition-all">
        <div className="flex gap-4 border-b dark:border-gray-700">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
  
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`pb-2 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default NavigationTabs;