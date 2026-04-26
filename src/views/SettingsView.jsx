import { useSecurity } from "../context/SecurityContext";
import { useAuth } from "../context/AuthContext";

export default function SettingsView() {
  const { encryptAll, updateSettings } = useSecurity();
  const { profile } = useAuth();

  const handleToggleEncryptAll = async () => {
    try {
      await updateSettings({ encryptAll: !encryptAll });
    } catch (err) {
      console.error("Failed to update settings:", err);
      alert("Failed to update settings.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-[var(--text-secondary)] font-medium mt-1">Manage your SoulScript preferences and security.</p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl p-8 shadow-xl space-y-8">
        {/* Security Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold text-white">Privacy & Security</h3>
            </div>

            <div className="flex items-center justify-between p-6 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                <div className="space-y-1">
                    <h4 className="font-bold text-white">Always Encrypt Entries</h4>
                    <p className="text-sm text-[var(--text-secondary)] pr-4">
                        When enabled, all your future journal entries will be automatically protected with client-side encryption.
                    </p>
                </div>
                <button
                    onClick={handleToggleEncryptAll}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                        encryptAll ? 'bg-[var(--ui-accent)]' : 'bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            encryptAll ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-200/80 leading-relaxed">
                    <strong>Note:</strong> SoulScript uses a unique <b>Vault Key</b> generated specifically for your account. 
                    This key is stored in your private profile. While more convenient than a manual password, 
                    remember that encryption is performed <i>before</i> saving to our database.
                </p>
            </div>
        </section>

        {/* Profile Info */}
        <section className="space-y-6 pt-8 border-t border-[var(--bg-soft)]">
            <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <h3 className="text-xl font-bold text-white">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Display Name</div>
                    <div className="font-bold text-white">{profile?.displayName || "Not set"}</div>
                </div>
                <div className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Email Address</div>
                    <div className="font-bold text-white">{profile?.email}</div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
