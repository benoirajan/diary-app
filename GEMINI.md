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
- **Smart Insights:** Prioritize narrative "takeaways" over raw data. Always calculate:
    - Habit vs Mood correlation (avg mood when habit=true vs false).
    - Weekly summaries with trend indicators (improved/steady/tougher).
    - Consistency scores and "Best Writing Day" analysis.
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
