import { useState, useEffect, useMemo } from "react";
import * as adminService from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

export default function AdminView() {
  const { isAdmin } = useAuth();
  const { confirm } = useModal();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userActivity, setUserActivity] = useState({ entries: [], habits: [], lastDoc: null, hasMore: false });
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // users, feedbacks
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
    loadFeedbacks();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await adminService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const allFeedbacks = await adminService.getFeedbacks();
      setFeedbacks(allFeedbacks);
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    setLoadingStats(true);
    try {
      const [stats, activity] = await Promise.all([
        adminService.getUserStats(userId),
        adminService.getUserActivity(userId)
      ]);
      setUserStats(stats);
      setUserActivity(activity);
    } catch (err) {
      console.error("Failed to load user stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const confirmed = await confirm({
      title: "Delete Feedback",
      message: "Are you sure you want to permanently delete this feedback? This action cannot be undone.",
      confirmText: "Delete",
      type: "danger"
    });

    if (confirmed) {
      try {
        await adminService.deleteFeedback(feedbackId);
        setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
        showToast("Feedback deleted successfully", "success");
      } catch (err) {
        console.error("Failed to delete feedback:", err);
        showToast("Failed to delete feedback", "error");
      }
    }
  };

  const loadMoreEntries = async () => {
    if (!selectedUserId || !userActivity.lastDoc || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const result = await adminService.getUserActivity(selectedUserId, userActivity.lastDoc);
      setUserActivity(prev => ({
        ...prev,
        entries: [...prev.entries, ...result.entries],
        lastDoc: result.lastDoc,
        hasMore: result.hasMore
      }));
    } catch (err) {
      console.error("Failed to load more entries", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === "admins") {
      result = result.filter(u => u.isAdmin);
    } else if (filter === "active") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter(u => u.lastLogin && (u.lastLogin.seconds * 1000) >= today.getTime());
    }

    return result;
  }, [users, searchTerm, filter]);

  if (!isAdmin) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-slate-400">You do not have administrative privileges.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1">Manage users and monitor SoulScript activity.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-lg">👥</span>
                <span className="font-bold text-[var(--text-primary)]">{users.length}</span>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Users</span>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-lg">💬</span>
                <span className="font-bold text-[var(--text-primary)]">{feedbacks.length}</span>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Feedbacks</span>
            </div>
            
            <button 
                onClick={() => { loadUsers(); loadFeedbacks(); }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--bg-soft)] hover:bg-[var(--bg-card)] transition-all border border-transparent hover:border-[var(--ui-accent)]"
            >
                🔄
            </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 p-1.5 bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl w-fit shadow-lg">
          <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === "users" 
                  ? "bg-[var(--ui-accent)] text-black shadow-md scale-105" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
          >
              User Directory
          </button>
          <button
              onClick={() => setActiveTab("feedbacks")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === "feedbacks" 
                  ? "bg-[var(--ui-accent)] text-black shadow-md scale-105" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
          >
              User Feedback
          </button>
      </div>

      {activeTab === "users" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* User List Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search users by name, email or ID..."
                    className="w-full px-6 py-4 bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl focus:ring-2 focus:ring-[var(--ui-accent)] transition-all outline-none text-[var(--text-primary)] shadow-sm group-hover:border-[var(--ui-accent)]/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
                </div>
                
                <div className="flex gap-2 p-1 bg-[var(--bg-soft)]/50 rounded-2xl border border-[var(--bg-soft)] w-fit">
                    {[
                        { label: "All", value: "all" },
                        { label: "Admins", value: "admins" },
                        { label: "Active Today", value: "active" }
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                filter === f.value 
                                ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm" 
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/30">
                    <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-2">Registered Users</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-10 text-center text-[var(--text-secondary)]">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-10 text-center text-[var(--text-secondary)]">No users found.</div>
                  ) : (
                    <div className="divide-y divide-[var(--bg-soft)]">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user.id)}
                          className={`w-full text-left p-5 flex items-center gap-4 transition-all hover:bg-[var(--bg-soft)]/50 ${
                            selectedUserId === user.id ? "bg-[var(--ui-accent-soft)] border-l-4 border-[var(--ui-accent)]" : "border-l-4 border-transparent"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[var(--ui-accent-soft)] border border-[var(--ui-accent)] flex items-center justify-center text-xl font-bold text-[var(--ui-accent)] shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                            {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[var(--text-primary)] truncate">{user.displayName || "Anonymous User"}</div>
                            <div className="text-sm text-[var(--text-secondary)] truncate">{user.email}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] opacity-50 font-mono mt-1 truncate uppercase">{user.id}</div>
                          </div>
                          <div className="text-right">
                            {user.isAdmin && (
                                <span className="text-[10px] font-black bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] px-2 py-1 rounded-lg uppercase tracking-wider border border-[var(--ui-accent)] mb-1 inline-block">Admin</span>
                            )}
                            <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase opacity-40">
                                {user.lastLogin ? new Date(user.lastLogin?.seconds * 1000).toLocaleDateString() : 'Never'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Detail Panel */}
            <div className="lg:col-span-7">
              {!selectedUserId ? (
                <div className="h-full min-h-[400px] bg-[var(--bg-card)]/50 border-2 border-dashed border-[var(--bg-soft)] rounded-3xl flex flex-col items-center justify-center p-10 text-center">
                  <div className="text-6xl mb-6 opacity-20">👤</div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Select a User</h3>
                  <p className="text-[var(--text-secondary)] max-w-xs">Click on a user from the list to view their detailed profile, activity stats, and journaling history.</p>
                </div>
              ) : loadingStats ? (
                <div className="h-full min-h-[400px] bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
                        <p className="text-[var(--text-secondary)] font-bold animate-pulse">Fetching Intelligence...</p>
                    </div>
                </div>
              ) : (
                <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                        
                        <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-400/30 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                {users.find(u => u.id === selectedUserId)?.displayName?.charAt(0) || "?"}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-[var(--text-primary)]">{users.find(u => u.id === selectedUserId)?.displayName || "Anonymous User"}</h2>
                                <p className="text-[var(--text-secondary)] font-medium">{users.find(u => u.id === selectedUserId)?.email}</p>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest">
                                    <div className="bg-[var(--bg-soft)] px-3 py-1.5 rounded-xl border border-[var(--bg-soft)] text-[var(--text-secondary)]">
                                        Member Since: <span className="text-[var(--text-primary)] ml-1">
                                            {users.find(u => u.id === selectedUserId)?.createdAt ? new Date(users.find(u => u.id === selectedUserId)?.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="bg-[var(--bg-soft)] px-3 py-1.5 rounded-xl border border-[var(--bg-soft)] text-[var(--text-secondary)]">
                                        ID: <span className="text-[var(--text-primary)] ml-1 font-mono">{selectedUserId.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Entries", value: userStats?.totalEntries || 0, icon: "📝" },
                            { label: "Habits Tracked", value: userStats?.totalHabits || 0, icon: "🎯" },
                            { label: "Avg Mood", value: userStats?.moodAvg + " / 5" || "N/A", icon: "✨" },
                            { label: "Last Active", value: userStats?.lastEntry ? new Date(userStats.lastEntry.createdAt?.seconds * 1000).toLocaleDateString() : "Never", icon: "🕒", isSmall: true }
                        ].map((stat, i) => (
                            <div key={i} className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl p-5 shadow-sm text-center md:text-left">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className={`text-2xl font-black text-[var(--text-primary)] ${stat.isSmall ? 'text-sm' : ''}`}>{stat.value}</div>
                                <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Activity Summary */}
                    <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/20 flex items-center justify-between">
                            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Recent Entries</h3>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{userStats?.totalEntries || 0} Total</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {userActivity.entries.length === 0 ? (
                                <p className="text-center py-10 text-[var(--text-secondary)] font-medium">No entries yet.</p>
                            ) : (
                                <>
                                    {userActivity.entries.map((entry, i) => (
                                        <div key={i} className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl hover:border-cyan-400/20 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[var(--text-primary)]">
                                                    {entry.isEncrypted ? "🔒 [Encrypted Title]" : entry.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{new Date(entry.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                                {entry.isEncrypted ? "Content is protected by client-side encryption and is unavailable to administrators." : entry.content}
                                            </p>
                                        </div>
                                    ))}

                                    {userActivity.hasMore && (
                                        <button
                                            onClick={loadMoreEntries}
                                            disabled={loadingMore}
                                            className="w-full py-3 mt-2 bg-[var(--bg-soft)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-black uppercase tracking-widest rounded-xl border border-transparent hover:border-[var(--ui-accent)] transition-all disabled:opacity-50"
                                        >
                                            {loadingMore ? "Fetching Data..." : "Load Older Entries ↓"}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/20 flex items-center justify-between">
                            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Habits</h3>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{userActivity?.habits?.length || 0} Active</span>
                        </div>
                        <div className="p-4 flex flex-wrap gap-2">
                            {userActivity?.habits?.length === 0 ? (
                                <p className="text-center w-full py-6 text-[var(--text-secondary)] font-medium">No habits configured.</p>
                            ) : (
                                userActivity?.habits?.map((habit, i) => (
                                    <div key={i} className="px-4 py-2 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-xl flex items-center gap-2">
                                        <span>{habit.icon || "✨"}</span>
                                        <span className="text-sm font-bold text-[var(--text-primary)]">{habit.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
              )}
            </div>
        </div>
      ) : (
        /* Feedbacks View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loadingFeedbacks ? (
                <div className="p-20 text-center text-[var(--text-secondary)] font-bold">Loading feedbacks...</div>
            ) : feedbacks.length === 0 ? (
                <div className="p-20 text-center bg-[var(--bg-card)]/50 border-2 border-dashed border-[var(--bg-soft)] rounded-3xl">
                    <div className="text-6xl mb-4 opacity-20">💬</div>
                    <p className="text-[var(--text-secondary)] font-bold">No feedback received yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {feedbacks.map((item) => {
                        const user = users.find(u => u.id === item.userId);
                        const typeColors = {
                            suggestion: "bg-[var(--suggestion)]/20 text-[var(--suggestion)] border-[var(--suggestion)]/20",
                            bug: "bg-[var(--bug)]/20 text-[var(--bug)] border-[var(--bug)]/20",
                            praise: "bg-[var(--praise)]/20 text-[var(--praise)] border-[var(--praise)]/20"
                        };

                        return (
                            <div key={item.id} className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl p-6 shadow-xl hover:border-[var(--ui-accent)]/30 transition-all flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border ${typeColors[item.type] || 'bg-gray-500/20 text-gray-300'}`}>
                                        {item.type}
                                    </span>
                                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                                        {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                                    </span>
                                </div>
                                
                                <p className="text-[var(--text-primary)] font-medium leading-relaxed mb-6 flex-1">
                                    “{item.feedback}”
                                </p>

                                <div className="pt-4 border-t border-[var(--bg-soft)] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[var(--bg-soft)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.displayName || "Anonymous"}</div>
                                        <div className="text-[10px] text-[var(--text-secondary)] truncate">{user?.email || item.userId}</div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setActiveTab("users");
                                            handleSelectUser(item.userId);
                                        }}
                                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-soft)] hover:bg-[var(--bg-card)] text-xs transition-all"
                                        title="View User"
                                    >
                                        👤
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteFeedback(item.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-soft)] hover:bg-red-500/20 text-red-500 text-xs transition-all"
                                        title="Delete Feedback"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      )}
    </div>
  );
}