import { useState, useMemo, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";
import useEntries from "./hooks/useEntries";
import useEntryStats from "./hooks/useEntryStats";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import InstallPrompt from "./components/InstallPrompt";
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
        loadingMore,
        hasMore,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        loadMore,
    } = useEntries();

    const {
        allMetadata,
        streak,
        refreshStats,
    } = useEntryStats();

    const [currentView, setCurrentView] = useState("list");
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Unified Navigation Handler
    const navigateTo = (view, id = null, replace = false) => {
        setSelectedEntryId(id);
        setCurrentView(view);
        const state = { view, id };
        if (replace) {
            window.history.replaceState(state, "", "");
        } else {
            window.history.pushState(state, "", "");
        }
    };

    // Sync state with browser history (Back button support)
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state) {
                setCurrentView(event.state.view);
                setSelectedEntryId(event.state.id);
            } else {
                setCurrentView("list");
                setSelectedEntryId(null);
            }
        };

        window.addEventListener("popstate", handlePopState);
        // Initial state
        window.history.replaceState({ view: "list", id: null }, "", "");

        return () => window.removeEventListener("popstate", handlePopState);
    }, []);
    
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

    // PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Show prompt if not dismissed recently
            const isDismissed = localStorage.getItem("soulscript_install_dismissed");
            if (!isDismissed) {
                setShowInstallPrompt(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // Check if already installed
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            if (isStandalone) {
                showToast("SoulScript is already installed!", "success");
            } else {
                // Show manual instructions for iOS/other browsers
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                if (isIOS) {
                    showToast("To install on iOS: Tap 'Share' then 'Add to Home Screen' 📲", "info");
                } else {
                    showToast("Use your browser menu to 'Add to Home Screen' 📲", "info");
                }
            }
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    // Check if the app is already running in standalone mode
    const isInstalled = useMemo(() => {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    }, []);

    const handleDismissInstall = () => {
        setShowInstallPrompt(false);
        // Don't show again for 7 days (simplified as a flag for now)
        localStorage.setItem("soulscript_install_dismissed", "true");
    };

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
            { 
                label: "Settings", 
                value: "settings", 
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                )
            },
        ];
        if (isAdmin) {
            baseTabs.push({ 
                label: "Admin", 
                value: "admin", 
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                ) 
            });
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
                            navigateTo("list");
                        }}
                        onCancel={() => navigateTo("list")}
                    />
                );

            case "detail":
                return (
                    <EntryDetail
                        entry={selectedEntry}
                        onBack={() => {
                            navigateTo("list");
                        }}
                        onDelete={(id) => {
                            deleteEntry(id);
                            navigateTo("list");
                            refreshStats();
                        }}
                        onUpdate={updateEntry}
                    />
                );

            case "analytics":
                return <AnalyticsView entries={allMetadata} />;

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
                            navigateTo("detail", entry.id);
                        }}
                        onLoadMore={loadMore}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                    />
                );
        }
    };

    if (!user) {
        return showAuth 
            ? <AuthPage 
                onBack={() => setShowAuth(false)} 
                isDark={isDark}
                themeMode={themeMode}
                onThemeChange={setThemeMode}
              /> 
            : <LandingPage 
                onGetStarted={() => setShowAuth(true)} 
                isDark={isDark}
                themeMode={themeMode}
                onThemeChange={setThemeMode}
              />;
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
                            navigateTo(value);
                        }}
                        onFeedback={() => setIsFeedbackFormOpen(true)}
                        onInstall={!isInstalled ? handleInstallClick : null}
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
                                    navigateTo(value);
                                }}
                                onFeedback={() => setIsFeedbackFormOpen(true)}
                                onInstall={!isInstalled ? handleInstallClick : null}
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
                                streak={streak}
                                showMenuButton={true}
                                onMenuClick={() => setIsMobileSidebarOpen(true)}
                                hideFeedback={true}
                            />
                        </div>

                        {/* Desktop Header Content */}
                        <div className="hidden lg:flex justify-end items-center mb-10 gap-4">
                            <Header
                                hideTitle={true}
                                streak={streak}
                            />
                        </div>
                        
                        {/* Main Content */}
                        <main className="animate-in mb-28 lg:mb-15 fade-in slide-in-from-bottom-4 duration-700">
                            {renderView()}
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav 
                currentView={currentView} 
                onTabChange={(value) => {
                    navigateTo(value);
                }} 
            />

            {/* PWA Install Prompt */}
            {showInstallPrompt && (
                <InstallPrompt 
                    onInstall={handleInstallClick} 
                    onDismiss={handleDismissInstall} 
                />
            )}

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
                            onSubmit={async (data) => {
                                await addEntry(data);
                                refreshStats();
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
                className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--accent-main)] text-black font-black shadow-xl shadow-[var(--accent-main)]/20 hover:scale-110 hover:shadow-[var(--accent-main)]/40 active:scale-95 transition-all group"
            >
                <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">New Entry</span>
            </button>
        </div>
    );
}

export default App;