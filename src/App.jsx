import { useState, useMemo } from "react";
import useEntries from "./hooks/useEntries";

import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";
import EntryDetail from "./components/EntryDetail";
import AnalyticsView from "./views/AnalyticsView";
import HabitsView from "./views/HabitsView";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./views/AuthPage";
import LandingPage from "./views/LandingPage";


function App() {

    const { user } = useAuth();
    // console.log(user)
    /*
      =========================
      Global State
      =========================
    */
    const {
        entries,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
    } = useEntries();

    const [currentView, setCurrentView] = useState("list");
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);

    /*
      =========================
      Derived State
      =========================
    */
    const streak = useMemo(() => {
        if (!entries || entries.length === 0) return 0;

        const daysWithEntries = [...new Set(entries
            .filter(e => e.createdAt)
            .map(e => {
                const date = e.createdAt.toDate();
                return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            })
        )].sort((a, b) => b - a);

        if (daysWithEntries.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMs = today.getTime();
        const yesterdayMs = todayMs - 86400000;

        if (daysWithEntries[0] < yesterdayMs) return 0;

        let currentStreak = 0;
        let expectedDay = daysWithEntries[0];

        for (const day of daysWithEntries) {
            if (day === expectedDay) {
                currentStreak++;
                expectedDay -= 86400000;
            } else {
                break;
            }
        }

        return currentStreak;
    }, [entries]);

    const filteredEntries = useMemo(() => {
        if (!searchTerm.trim()) return entries;

        return entries.filter((entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [entries, searchTerm]);

    const selectedEntry = useMemo(() => {
        if (!selectedEntryId) return null;
        return entries.find(e => e.id === selectedEntryId);
    }, [entries, selectedEntryId]);

    /*
      =========================
      View Renderer
      =========================
    */
    const renderView = () => {
        if (loading) {
            return (
                <div className="p-6 text-center text-gray-500">
                    Loading entries...
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6 text-center text-red-500">
                    {error}
                </div>
            );
        }

        switch (currentView) {
            case "edit":
                return (
                    <EntryForm
                        initialData={selectedEntry}
                        onSubmit={(data) => {
                            updateEntry(selectedEntry.id, data);
                            setCurrentView("list");
                        }}
                        onCancel={() => setCurrentView("list")}
                    />
                );

            case "detail":
                return (
                    <EntryDetail
                        entry={selectedEntry}
                        onBack={() => {
                            setSelectedEntryId(null);
                            setCurrentView("list");
                        }}
                        onDelete={(id) => {
                            deleteEntry(id);
                            setSelectedEntryId(null);
                            setCurrentView("list");
                        }}
                        onUpdate={updateEntry}
                    />
                );

            case "analytics":
                return <AnalyticsView entries={entries} />;

            case "habits":
                return <HabitsView />;

            case "list":
            default:
                return (
                    <EntryList
                        entries={filteredEntries}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSelectEntry={(entry) => {
                            setSelectedEntryId(entry.id);
                            setCurrentView("detail");
                        }}
                        onEditEntry={(entry) => {
                            setSelectedEntryId(entry.id);
                            setCurrentView("edit");
                        }}
                    />
                );
        }
    };

    if (!user) {
        return showAuth 
            ? <AuthPage onBack={() => setShowAuth(false)} /> 
            : <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "dark" : ""}`}>
            <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-happy)]/30 lg:flex">
                
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[var(--bg-card)] border-r border-[var(--bg-soft)] p-6 z-40">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                            SoulScript<span className="text-[var(--accent-happy)]">.</span>
                        </h1>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1 opacity-50">Digital Soul Journal</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {[
                            { label: "Entries", value: "list", icon: "📑" },
                            { label: "Habits", value: "habits", icon: "🎯" },
                            { label: "Analytics", value: "analytics", icon: "📊" },
                        ].map((tab) => {
                            const isActive = (currentView === "detail" ? "list" : currentView) === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => {
                                        setSelectedEntryId(null);
                                        setCurrentView(tab.value);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                                        isActive
                                            ? "bg-[var(--accent-happy)]/10 text-[var(--accent-happy)] border border-[var(--accent-happy)]/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
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
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Dark Mode</span>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-soft)] hover:border-[var(--accent-happy)] transition-all text-lg"
                            >
                                {darkMode ? "🌙" : "☀️"}
                            </button>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col min-h-screen">
                    <div className="max-w-5xl w-full mx-auto px-6 py-6 flex-1">
                        {/* Mobile Header */}
                        <div className="lg:hidden">
                            <Header
                                title="SoulScript"
                                isDarkMode={darkMode}
                                onToggleDarkMode={() => setDarkMode(!darkMode)}
                                streak={streak}
                            />
                        </div>

                        {/* Desktop Header Content */}
                        <div className="hidden lg:flex justify-end items-center mb-10 gap-4">
                            <Header
                                title=""
                                isDarkMode={darkMode}
                                hideTitle={true}
                                hideToggle={true}
                                streak={streak}
                            />
                        </div>
                        
                        {/* Mobile Tabs */}
                        <div className="lg:hidden">
                            <NavigationTabs
                                tabs={[
                                    { label: "Entries", value: "list" },
                                    { label: "Habits", value: "habits" },
                                    { label: "Analytics", value: "analytics" },
                                ]}
                                activeTab={currentView === "detail" ? "list" : currentView}
                                onTabChange={(value) => {
                                    setSelectedEntryId(null);
                                    setCurrentView(value);
                                }}
                            />
                        </div>

                        {/* Main Content */}
                        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {renderView()}
                        </main>
                    </div>
                </div>
            </div>

            {/* Popup Dialog for Entry Creation */}
            {isEntryFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-sm"
                        onClick={() => setIsEntryFormOpen(false)}
                    ></div>
                    
                    {/* Dialog Content */}
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                        <EntryForm
                            onSubmit={(data) => {
                                addEntry(data);
                                setIsEntryFormOpen(false);
                            }}
                            onCancel={() => setIsEntryFormOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Sticky "New Entry" FAB */}
            <button
                onClick={() => setIsEntryFormOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:scale-110 hover:shadow-[0_0_40px_rgba(0,255,255,0.7)] active:scale-95 transition-all group"
            >
                <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">New Entry</span>
            </button>
        </div>
    );
}

export default App;