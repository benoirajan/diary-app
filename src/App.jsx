import { useState, useMemo } from "react";
import useEntries from "./hooks/useEntries";

import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";
import EntryDetail from "./components/EntryDetail";
import AnalyticsView from "./views/AnalyticsView";
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

    /*
      =========================
      Derived State
      =========================
    */
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
            case "create":
                return (
                    <EntryForm
                        onSubmit={(data) => {
                            addEntry(data);
                            setCurrentView("list");
                        }}
                    />
                );

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
            <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-happy)]/30">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    {/* Header */}
                    <Header
                        title="SoulScript"
                        isDarkMode={darkMode}
                        onToggleDarkMode={() => setDarkMode(!darkMode)}
                        onPrimaryAction={() => setCurrentView("create")}
                        primaryActionLabel="New Entry"
                    />
                    
                    {/* Tabs */}
                    <NavigationTabs
                        tabs={[
                            { label: "Entries", value: "list" },
                            { label: "Create", value: "create" },
                            { label: "Analytics", value: "analytics" },
                        ]}
                        activeTab={currentView === "detail" ? "list" : currentView}
                        onTabChange={(value) => {
                            setSelectedEntryId(null);
                            setCurrentView(value);
                        }}
                    />

                    {/* Main Content */}
                    <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {renderView()}
                    </main>
                </div>
            </div>
        </div>

    );
}

export default App;