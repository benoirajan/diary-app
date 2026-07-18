
/**
 * Notification Service for SoulScript
 * Handles permission requests and local notification triggers.
 */

const REMINDER_KEY = "soulscript_last_reminder_date";
const SETTINGS_KEY = "soulscript_notification_settings";

export const NOTIFICATION_SETTINGS_DEFAULT = {
    enabled: false,
    reminderTime: "20:00", // 8 PM default
};

export const getNotificationSettings = () => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : NOTIFICATION_SETTINGS_DEFAULT;
};

export const saveNotificationSettings = (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.warn("This browser does not support notifications.");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

export const sendLocalNotification = async (title, body) => {
    if (Notification.permission !== "granted") return;

    // Use Service Worker for better PWA support if available
    if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
            body,
            icon: "/favicon.svg",
            badge: "/favicon.svg",
            vibrate: [200, 100, 200],
            tag: "soulscript-reminder",
            renotify: true,
            data: {
                url: window.location.origin
            }
        });
    } else {
        // Fallback to standard Notification
        new Notification(title, { body, icon: "/favicon.svg" });
    }
};

/**
 * Checks if a reminder should be shown based on user settings.
 * Runs on app load/resume.
 */
export const checkAndTriggerReminder = async () => {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const lastReminder = localStorage.getItem(REMINDER_KEY);
    const today = new Date().toISOString().split("T")[0];

    // Already reminded today
    if (lastReminder === today) return;

    const now = new Date();
    const [hours, minutes] = settings.reminderTime.split(":").map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If it's past the reminder time, trigger it
    if (now >= reminderTime) {
        await sendLocalNotification(
            "Time for SoulScript ✨",
            "How was your day? Take a moment to reflect and write it down."
        );
        localStorage.setItem(REMINDER_KEY, today);
    }
};
