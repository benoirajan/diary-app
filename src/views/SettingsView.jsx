import { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
    getNotificationSettings, 
    saveNotificationSettings, 
    requestNotificationPermission 
} from "../services/notificationService";

const ToggleButton = ({ isOn, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
            isOn ? 'bg-[var(--ui-accent)]' : 'bg-[var(--bg-hover)]'
        }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-[var(--bg-main)] transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);


export default function SettingsView() {
  const { encryptAll, updateSettings } = useSecurity();
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [notifSettings, setNotifSettings] = useState(getNotificationSettings());

  const handleToggleReminders = async () => {
    if (!notifSettings.enabled) {
        const granted = await requestNotificationPermission();
        if (!granted) {
            showToast("Notification permission denied.", "error");
            return;
        }
    }

    const newSettings = { ...notifSettings, enabled: !notifSettings.enabled };
    setNotifSettings(newSettings);
    saveNotificationSettings(newSettings);
    showToast(newSettings.enabled ? "Daily reminders enabled ✨" : "Reminders disabled.");
  };

  const handleTimeChange = (e) => {
    const newSettings = { ...notifSettings, reminderTime: e.target.value };
    setNotifSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleToggleEncryptAll = async () => {
    try {
      await updateSettings({ encryptAll: !encryptAll });
      showToast("Settings updated successfully.");
    } catch (err) {
      console.error("Failed to update settings:", err);
      showToast("Failed to update settings.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Settings</h1>
        <p className="text-[var(--text-secondary)] font-medium mt-1">Manage your SoulScript preferences and security.</p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-3xl p-8 shadow-xl space-y-8">
        {/* Security Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold">Privacy & Security</h3>
            </div>

            <div className="flex items-center justify-between p-6 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                <div className="space-y-1">
                    <h4 className="font-bold ">Always Encrypt Entries</h4>
                    <p className="text-sm text-[var(--text-secondary)] pr-4">
                        When enabled, all your future journal entries will be automatically protected with client-side encryption.
                    </p>
                </div>
                <ToggleButton isOn={encryptAll} onToggle={handleToggleEncryptAll} />
            </div>

            <div className="p-4 bg-[var(--ui-accent)]/10 border border-[var(--ui-accent)]/20 rounded-xl">
                <p className="text-xs text-[var(--ui-accent)] leading-relaxed">
                    <strong>Note:</strong> SoulScript uses a unique <b>Vault Key</b> generated specifically for your account. 
                    This key is stored in your private profile. While more convenient than a manual password, 
                    remember that encryption is performed <i>before</i> saving to our database.
                </p>
            </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-6 pt-8 border-t border-[var(--bg-soft)]">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <h3 className="text-xl font-bold">Reminders</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                    <div className="space-y-1">
                        <h4 className="font-bold">Daily Reminder</h4>
                        <p className="text-sm text-[var(--text-secondary)] pr-4">
                            Get a gentle nudge to record your thoughts and feelings every day.
                        </p>
                    </div>
                    <ToggleButton isOn={notifSettings.enabled} onToggle={handleToggleReminders} />
                </div>

                {notifSettings.enabled && (
                    <div className="flex items-center justify-between p-6 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="space-y-1">
                            <h4 className="font-bold">Reminder Time</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                                When should we remind you?
                            </p>
                        </div>
                        <input
                            type="time"
                            value={notifSettings.reminderTime}
                            onChange={handleTimeChange}
                            className="bg-[var(--bg-main)] border border-[var(--bg-soft)] rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--ui-accent)] transition-all"
                        />
                    </div>
                )}
            </div>
        </section>

        {/* Account Information Section */}
        <section className="space-y-6 pt-8 border-t border-[var(--bg-soft)]">
            <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <h3 className="text-xl font-bold ">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Display Name</div>
                    <div className="font-bold ">{profile?.displayName || "Not set"}</div>
                </div>
                <div className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--bg-soft)] rounded-2xl">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Email Address</div>
                    <div className="font-bold ">{profile?.email}</div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
