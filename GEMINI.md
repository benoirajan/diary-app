# SoulScript Project Instructions

This file (`GEMINI.md`) contains custom instructions and context for the Gemini CLI specific to this project.
The Gemini CLI will read this file and prioritize these instructions over its default behavior.

## Project Context
- **Project Name:** SoulScript (formerly AI Diary)
- **Project Type:** React (Vite) Single Page Application (Journaling + Habit Tracking)
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **AI Integration:** Google Gemini AI (via client-side or functions)
- **Styling:** Vanilla CSS with a "Soft Warm Minimal" futuristic aesthetic.

## Development Guidelines
- **Component Style:** Use functional components with hooks.
- **File Naming:** React components should use PascalCase (e.g., `MyComponent.jsx`). Hooks should use camelCase and start with `use` (e.g., `useEntries.js`, `useHabits.js`).
- **Imports:** Group imports logically (React/Libraries first, then local components, then assets/styles).
- **State Management:** When dealing with lists and details, prefer storing a `selectedId` and using `useMemo` to find the object in the main list. This prevents stale data when updates occur.
- **Component Reusability:** Reuse `EntryForm.jsx` for both creating and editing entries by passing `initialData`.
- **Git Flow:** After every successful task/feature, stage the changes (`git add .`) and commit with a concise, descriptive message.

## Common Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Deploy to Firebase:** `firebase deploy`

## Agent Mandates
- **Rename Integrity:** Ensure the name "SoulScript" is used in all user-facing strings and documentation.
- **Auth Support:** Maintain support for both Email/Password and Google Authentication.
- **Data Integrity:** Always ensure new Firestore queries are supported by appropriate indexes in `firestore.indexes.json` and rules in `firestore.rules`.
- **UI/UX:** When modifying UI components, ensure responsiveness and maintain the established glow-based futuristic aesthetic.
- **Habit Tracking:** Ensure streak calculation logic remains consistent across the app and that habit completions are stored with ISO date strings (YYYY-MM-DD).
- **Error Handling:** Prefer explicit, user-friendly error handling for Firebase and AI operations.
