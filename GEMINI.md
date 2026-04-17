# SoulScript Project Instructions

This file (`GEMINI.md`) contains custom instructions and context for the Gemini CLI specific to this project.
The Gemini CLI will read this file and prioritize these instructions over its default behavior.

## Project Context
- **Project Name:** SoulScript (formerly AI Diary)
- **Project Type:** React (Vite) Single Page Application (Journaling + Habit Tracking + Emotional Analytics)
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **AI Integration:** Google Gemini AI (via client-side or functions)
- **Styling:** Vanilla CSS with a "Soft Warm Minimal" futuristic aesthetic (high-glow, deep contrast).

## Development Guidelines
- **Component Style:** Use functional components with hooks.
- **File Naming:** React components should use PascalCase (e.g., `MyComponent.jsx`). Hooks should use camelCase and start with `use` (e.g., `useEntries.js`, `useHabits.js`).
- **Imports:** Group imports logically (React/Libraries first, then local components, then assets/styles).
- **State Management:** When dealing with lists and details, prefer storing a `selectedId` and using `useMemo` to find the object in the main list.
- **Responsive Layout:**
    - **Mobile:** Uses a bottom-navigation tab system and full-width header.
    - **Desktop (lg+):** Uses a persistent vertical sidebar for navigation and an optimized wide-content area.
- **Entry Creation:** Always use the popup modal (`isEntryFormOpen` state) instead of a dedicated view for new entries to maintain user context.
- **Sticky Actions:** The "New Entry" action is permanently accessible via a Floating Action Button (FAB) at the bottom-right.
- **Git Flow:** After every successful task/feature, stage the changes (`git add .`) and commit with a concise, descriptive message.

## Analytics Engine
- **Mood Scoring:** Map moods to a 1-5 scale (Excited=5, Happy=4, Calm=3, Sad=2, Angry=1) for calculating averages and trends.
- **Well-being Score (0-100):** A composite metric weighted as:
    - **Habit Completion (40%):** Discipline and routine.
    - **Writing Consistency (30%):** Self-reflection frequency.
    - **Mood Trend (30%):** Emotional trajectory.
- **Dashboard Layout:** Always structure the Analytics view following this 6-point hierarchy:
    1. 🔥 **Insight Card:** Well-being status (Radiant, Balanced, Growing, Recovering) and Weekly Summary.
    2. 📈 **Mood Trend Graph:** SVG-based 14-day emotional journey.
    3. 🧠 **Habit vs Mood Insights:** Correlations between specific habits and mood improvements.
    4. 📊 **Habit Completion Rates:** Progress bars for individual habit performance.
    5. ✍️ **Writing Stats:** Total entries, consistency %, and avg per week.
    6. 🔁 **Streak Section:** Current/Longest streaks and break pattern analysis.
- **Smart Insights:** Prioritize narrative "takeaways". Include "Comeback Insights" when users return after a 2+ day break to encourage consistency without guilt.
- **Visualizations:** Prefer custom SVG components (like the `MoodChart`) to maintain the project's unique aesthetic without external charting dependencies.

## Common Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Deploy to Firebase:** `firebase deploy`

## Agent Mandates
- **Rename Integrity:** Ensure the name "SoulScript" is used in all user-facing strings and documentation.
- **Auth Support:** Maintain support for both Email/Password and Google Authentication.
- **Data Integrity:** Always ensure new Firestore queries are supported by appropriate indexes in `firestore.indexes.json` and rules in `firestore.rules`.
- **UI/UX:** Maintain the established glow-based futuristic aesthetic. Use `animate-in` utilities for all major view transitions.
- **Habit Tracking:** Ensure habit completions are stored with ISO date strings (YYYY-MM-DD).
- **Error Handling:** Prefer explicit, user-friendly error handling for Firebase and AI operations.
