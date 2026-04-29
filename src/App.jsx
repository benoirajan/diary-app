import { useState, useMemo, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";
import useEntries from "./hooks/useEntries";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import EntryForm from "./components/EntryForm";
import FeedbackForm from "./components/FeedbackForm";
import EntryList from "./components/EntryList";
import EntryDetail from "./components/EntryDetail";
import AnalyticsView from "./views/AnalyticsView";
import HabitsView from "./views/HabitsView";
import AdminView from "./views/AdminView";
import SettingsView from "./views/SettingsView";
import { useAuth } from "./context/AuthContext";
import { useRemoteConfig } from "./context/RemoteConfigContext";
import AuthPage from "./views/AuthPage";
import LandingPage from "./views/LandingPage";
import { submitFeedback } from "./services/feedbackService";
import { useToast } from "./context/ToastContext";


function App() {

    const { user, isAdmin } = useAuth();
    const { showToast } = useToast();
    const { config, loading: configLoading } = useRemoteConfig();
    
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    
    // Theme state: 'light' | 'dark' | 'system'
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem("soulscript_theme") || "system";
    });

    // Resolved dark mode boolean
    const [isDark, setIsDark] = useState(true);

    // Sync resolved dark mode with themeMode and system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleChange = () => {
            if (themeMode === "system") {
                setIsDark(mediaQuery.matches);
            } else {
                setIsDark(themeMode === "dark");
            }
        };

        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        localStorage.setItem("soulscript_theme", themeMode);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [themeMode]);
    
    const [showAuth, setShowAuth] = useState(false);
    const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    // Remote Config override (only applies if no local preference is set)
    useEffect(() => {
        if (!configLoading && !localStorage.getItem("soulscript_theme")) {
            setThemeMode(config.is_light ? "light" : "dark");
        }
    }, [config.is_light, configLoading]);

    /*
      =========================
      Analytics Tracking
      =========================
    */
    useEffect(() => {
        logEvent(analytics, "screen_view", {
            screen_name: currentView,
            screen_class: "App",
        });
    }, [currentView]);

    /*
      =========================
      Derived State
      =========================
    */
    const streak = useMemo(() => {
        if (!entries || entries.length === 0) return 0;

        const daysWithEntries = [...new Set(entries
            .filter(e => e.date || e.createdAt)
            .map(e => {
                let date;
                if (e.date) {
                    date = new Date(e.date);
                } else if (e.createdAt && typeof e.createdAt.toDate === 'function') {
                    date = e.createdAt.toDate();
                } else {
                    date = new Date(e.createdAt);
                }
                return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            })
        )].sort((a, b) => b - a);

        if (daysWithEntries.length === 0) return 0;

        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();


        // If the latest entry is before yesterday, the streak is broken
        if (daysWithEntries[0] < yesterday) return 0;

        let currentStreak = 0;
        let expectedDay = daysWithEntries[0];

        for (const day of daysWithEntries) {
            // Use a small buffer (1 hour) for comparison to be safe against DST shifts if they somehow creep in
            if (Math.abs(day - expectedDay) < 3600000) {
                currentStreak++;
                // Set expectedDay to exactly midnight of the previous day
                const prevDay = new Date(expectedDay);
                prevDay.setDate(prevDay.getDate() - 1);
                expectedDay = prevDay.getTime();
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

    const tabs = useMemo(() => {
        const baseTabs = [
            { label: "Entries", value: "list", icon: "📑" },
            { label: "Habits", value: "habits", icon: "🎯" },
            { label: "Analytics", value: "analytics", icon: "📊" },
            { label: "Settings", value: "settings", icon: "⚙️" },
        ];
        if (isAdmin) {
            baseTabs.push({ label: "Admin", value: "admin", icon: "🛡️" });
        }
        return baseTabs;
    }, [isAdmin]);

    const handleFeedbackSubmit = async (feedbackData) => {
        setIsSubmittingFeedback(true);
        try {
            await submitFeedback(user.uid, feedbackData);
            setIsFeedbackFormOpen(false);
            showToast("Thank you for your feedback!", "success");
        } catch (err) {
            console.error("Error submitting feedback:", err);
            showToast("Failed to submit feedback. Please try again.", "error");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

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

            case "admin":
                return <AdminView />;

            case "settings":
                return <SettingsView />;

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
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? "dark" : ""}`}>
            <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--ui-accent)]/30 lg:flex">
                
                {/* Desktop Sidebar */}
                <div className="hidden lg:block h-screen sticky top-0">
                    <Sidebar 
                        tabs={tabs}
                        currentView={currentView}
                        onTabChange={(value) => {
                            setSelectedEntryId(null);
                            setCurrentView(value);
                        }}
                        onFeedback={() => setIsFeedbackFormOpen(true)}
                        themeMode={themeMode}
                        onThemeChange={setThemeMode}
                    />
                </div>

                {/* Mobile Sidebar */}
                {isMobileSidebarOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
                        <div 
                            className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-sm"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        ></div>
                        <div className="relative h-full w-64 animate-in slide-in-from-left duration-300">
                            <Sidebar 
                                tabs={tabs}
                                currentView={currentView}
                                onTabChange={(value) => {
                                    setSelectedEntryId(null);
                                    setCurrentView(value);
                                }}
                                onFeedback={() => setIsFeedbackFormOpen(true)}
                                themeMode={themeMode}
                                onThemeChange={setThemeMode}
                                onClose={() => setIsMobileSidebarOpen(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col min-h-screen">
                    <div className=" w-full mx-auto px-6 md:px-10 lg:px-16 py-6 flex-1">
                        {/* Mobile Header */}
                        <div className="lg:hidden">
                            <Header
                                themeMode={themeMode}
                                onThemeChange={setThemeMode}
                                streak={streak}
                                showMenuButton={true}
                                onMenuClick={() => setIsMobileSidebarOpen(true)}
                                hideFeedback={true}
                                hideSignOut={true}
                            />
                        </div>

                        {/* Desktop Header Content */}
                        <div className="hidden lg:flex justify-end items-center mb-10 gap-4">
                            <Header
                                themeMode={themeMode}
                                onThemeChange={setThemeMode}
                                hideTitle={true}
                                hideToggle={false}
                                streak={streak}
                            />
                        </div>
                        
                        {/* Main Content */}
                        <main className="animate-in mb-15 fade-in slide-in-from-bottom-4 duration-700">
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

            {/* Feedback Modal */}
            {isFeedbackFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-sm"
                        onClick={() => setIsFeedbackFormOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <FeedbackForm
                            onSubmit={handleFeedbackSubmit}
                            onCancel={() => setIsFeedbackFormOpen(false)}
                            isSubmitting={isSubmittingFeedback}
                        />
                    </div>
                </div>
            )}

            {/* Sticky "New Entry" FAB */}
            <button
                onClick={() => setIsEntryFormOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--accent-main)] text-black font-black shadow-xl shadow-[var(--accent-main)]/20 hover:scale-110 hover:shadow-[var(--accent-main)]/40 active:scale-95 transition-all group"
            >
                <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">New Entry</span>
            </button>
        </div>
    );
}

export default App;