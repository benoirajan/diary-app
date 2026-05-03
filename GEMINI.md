# SoulScript Project Instructions

This file (`GEMINI.md`) contains custom instructions and context for the Gemini CLI specific to this project.
The Gemini CLI will read this file and prioritize these instructions over its default behavior.

## Project Context
- **Project Name:** SoulScript (formerly AI Diary)
- **Project Type:** React (Vite) Single Page Application (Journaling + Habit Tracking + Emotional Analytics)
- **Backend:** Firebase (Firestore, Authentication, Hosting, Analytics, Remote Config)
- **App Usage Tracking:** Google Analytics (GA4) integrated for monitoring user engagement and feature adoption.
- **AI Integration:** Google Gemini AI (via client-side or functions)
    - **Automatic Mood Discovery:** Real-time sentiment analysis in `EntryForm.jsx`. Automatically selects the detected mood and displays a "✨ AI thinks you feel [mood]" indicator for transparency.
    - **Daily Soul Insights:** On-demand deep analysis in `AnalyticsView.jsx`. Restricted to daily once, with results stored in Firestore (`users/{uid}/aiInsights/history`) using a map of dates to limit storage and document count. **Pruned automatically to keep only the last 30 insights.**
    - **Model Management:** Uses Firebase Remote Config (`aiModel`) to dynamically select the Gemini model. Defaults to `gemini-2.5-flash-lite`.
    - **Feature Toggling:** AI features can be globally enabled/disabled via Remote Config (`isAiEnabled`).
    - **SDK:** Uses the newer `@google/genai` package for enhanced performance.
    - **Debounce Logic:** Analysis is triggered after a 2.5s delay and 30+ character input to optimize API usage.
- **Styling:** Vanilla CSS with a "Soft Warm Minimal" futuristic aesthetic (high-glow, deep contrast).
- **Theme System:** 
    - Supports **Light**, **Dark**, and **System** (Device Default) modes.
    - Avoid using these colors in the UI because it is mood colors (--accent-happy,  --accent-sad,  --accent-angry,  --accent-neutral,  --accent-excited,--accent-calm)
    - Avoid using independent colors in the UI if the color is not available in the existing theme create new one
    - Persists user preference in `localStorage` (`soulscript_theme`).
    - Synchronizes with system appearance changes when in "System" mode.
    - Remote Config (`is_light`) acts as a global override if no local preference exists.

## Development Guidelines
- **Component Style:** Use functional components with hooks.
- **File Naming:** React components should use PascalCase (e.g., `MyComponent.jsx`). Hooks should use camelCase and start with `use` (e.g., `useEntries.js`, `useHabits.js`).
- **Imports:** Group imports logically (React/Libraries first, then local components, then assets/styles).
- **State Management:** When dealing with lists and details, prefer storing a `selectedId` and using `useMemo` to find the object in the main list.
- **Remote Config:** Use `RemoteConfigContext` (`useRemoteConfig`) to access global configuration values.
- **Responsive Layout:**
    - **Mobile:** Uses a toggleable sidebar (hamburger menu) for navigation. The header focuses on the streak and branding.
    - **Desktop (lg+):** Uses a persistent vertical sidebar for navigation. Maintains a spacious layout with responsive horizontal padding (`md:px-10 lg:px-16`) and internal card spacing to prevent content from feeling cramped.
    - **Sidebar Footer:** Actions (Feedback, Theme Switcher, Sign Out) are organized in a vertical stack at the bottom of the sidebar.
- **Entry Creation:** Always use the popup modal (`isEntryFormOpen` state) instead of a dedicated view for new entries to maintain user context.
- **Mindful Editing:** Editing past entries is intentionally discouraged with a philosophical confirmation prompt ("Alter the Past?") to preserve the integrity of the user's emotional history.
- **Journal Aesthetic:** The `EntryDetail` view follows a "Futuristic Analog" design, featuring a vertical margin line, date-stamp headers, and signature footers to evoke the feel of a physical journal.
- **Feedback Loop:** Use the `FeedbackForm.jsx` modal for collecting user suggestions, bug reports, and praise. Submissions are stored in the global `feedback` collection.
- **Sticky Actions:** The "New Entry" action is permanently accessible via a Floating Action Button (FAB) at the bottom-right.
- **Git Flow:** After every successful task/feature, stage the changes (`git add .`) and commit with a concise, descriptive message.

## Analytics Engine
- **Mood Scale:** SoulScript uses a specialized mindful scale for mapping human emotions (1-5):
    - **Radiant (5):** Peak energy and joy.
    - **Joyful (4):** Positive and light.
    - **Peaceful (3):** Balanced and steady (Baseline/Default).
    - **Down (2):** Low energy or heavy.
    - **Rough (1):** High distress or overwhelmed (Replaces "Angry").
- **Centralized Moods:** Always use helper functions from `src/constants/moods.js` (`getMoodLabel`, `getMoodEmoji`, `getMoodScore`) to maintain consistency.
- **Well-being Score (0-100):** A composite metric weighted as:
    - **Habit Completion (40%):** Discipline and routine.
    - **Writing Consistency (30%):** Self-reflection frequency.
    - **Mood Trend (30%):** Emotional trajectory.
- **Streak Calculation:** Streaks are calculated using the user-selected `date` field (ISO string) and normalized to midnight. Calculation must be robust against Daylight Saving Time shifts.
- **Dashboard Layout:** Always structure the Analytics view following this 7-point hierarchy:
    1. ✨ **AI Soul Insight:** On-demand daily deep analysis card (Visible only if `isAiEnabled` is true).
    2. 🔥 **Insight Card:** Well-being status (Radiant, Balanced, Growing, Recovering) and Weekly Summary.
    3. 📈 **Mood Trend Graph:** SVG-based 14-day emotional journey.
    4. 🧠 **Habit vs Mood Insights:** Correlations between specific habits and mood improvements.
    5. 📊 **Habit Completion Rates:** Progress bars for individual habit performance.
    6. ✍️ **Writing Stats:** Total entries, consistency %, and avg per week.
    7. 🔁 **Streak Section:** Current/Longest streaks and break pattern analysis.
- **Smart Insights:** Prioritize narrative "takeaways". Include "Comeback Insights" when users return after a 2+ day break to encourage consistency without guilt.
- **Visualizations:** Prefer custom SVG components (like the `MoodChart`) to maintain the project's unique aesthetic without external charting dependencies.
- **Modular Dashboard:** The Analytics view is split into specialized components in `src/components/analytics/` and powered by the `useAnalytics` hook to keep logic separate from presentation.

## Google Analytics
- **Implementation:** Firebase Analytics (GA4). Initialized in `src/firebase.js`.
- **Core Events Tracked:**
    - `login` / `sign_up`: Captured in `AuthContext.jsx`.
    - `create_entry`: Tracked in `entryService.js` (includes mood and AI status).
    - `add_habit` / `complete_habit`: Tracked in `habitService.js`.
    - `submit_feedback`: Tracked in `feedbackService.js`.
    - `screen_view`: Automatically tracked in `App.jsx` based on `currentView` state.
- **Privacy:** Tracking is focused on feature usage and navigation to improve the UX. Personal journal content is NEVER sent to Analytics.

## Admin Module
- **Access Control:** Restricted to users with `isAdmin: true` in their Firestore document (`/users/{uid}`).
- **Features:** 
    - **User Directory:** Searchable list of all registered users with filters for "Admins" and "Active Today".
    - **User Profiles:** View aggregated stats (total entries, habits, avg mood) and last activity date.
    - **User Feedback:** View a list of categorized feedback submissions (Suggestions, Bugs, Praise).
    - **Feedback Management:** Ability to permanently delete user feedback submissions.
    - **Paginated Activity:** View a scrollable, paginated history of user entries (15 entries per load).
- **Service Integration:** Use `adminService.js` for administrative queries and data migrations.
- **Security:** Administrative access is enforced both via UI (`isAdmin` flag in `AuthContext`) and Backend (`firestore.rules`).

## Security & Privacy
- **Client-Side Encryption (Zero-Knowledge):** SoulScript uses the Web Crypto API (AES-GCM 256-bit) to encrypt entry titles and content before they are sent to Firestore.
- **Managed Vault Key:** 
    - A unique, high-entropy 32-character key is automatically generated for every user upon sign-up.
    - The key is stored in the user's private profile document.
    - Encryption/Decryption happens entirely on the client side; the server only ever sees the encrypted ciphertext.
- **Encryption Modes:**
    - **Global:** "Always Encrypt Entries" can be enabled in the Settings view to protect all future entries automatically.
    - **Per-Entry:** Users can manually toggle encryption for specific entries within the `EntryForm.jsx`.
    - **Default Setting:** New users inherit the global default from Remote Config (`is_encrypted`).
- **Admin Transparency:** 
    - Administrators can view user analytics, mood trends, and activity stats.
    - Encrypted content and titles are masked in the Admin Dashboard (`🔒 [Encrypted]`) to preserve user privacy.
- **Real-time Synchronization:** User settings and profile changes are synced in real-time using Firestore `onSnapshot` listeners in `AuthContext.jsx`.

## Common Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Deploy to Firebase:** `firebase deploy`
- **Deploy Rules Only:** `firebase deploy --only firestore:rules`

## Agent Mandates
- **Rename Integrity:** Ensure the name "SoulScript" is used in all user-facing strings and documentation.
- **Auth Support:** Maintain support for both Email/Password and Google Authentication.
- **User Profiles:** Ensure every authenticated user has a corresponding document in the `users` collection.
- **Admin Security:** Never expose administrative functionality or user data to non-admin users. Always verify the `isAdmin` flag from `AuthContext`.
- **Data Integrity:** Always ensure new Firestore queries are supported by appropriate indexes in `firestore.indexes.json` and rules in `firestore.rules`.
- **UI/UX:** Maintain the established glow-based futuristic aesthetic. Use `animate-in` utilities for all major view transitions.
- **Habit Tracking:** Ensure habit completions are stored with ISO date strings (YYYY-MM-DD).
- **Error Handling:** Prefer explicit, user-friendly error handling for Firebase and AI operations. Use the global `ToastContext` (`useToast`) for system-wide notifications and error snackbars.
