# Gemini CLI Project Instructions

This file (`GEMINI.md`) contains custom instructions and context for the Gemini CLI specific to this project.
The Gemini CLI will read this file and prioritize these instructions over its default behavior.

## Project Context
- **Project Type:** React (Vite) Single Page Application
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **Styling:** Vanilla CSS

## Development Guidelines
- **Component Style:** Use functional components with hooks.
- **File Naming:** React components should use PascalCase (e.g., `MyComponent.jsx`). Hooks should use camelCase and start with `use` (e.g., `useEntries.js`).
- **Imports:** Group imports logically (React/Libraries first, then local components, then assets/styles).
- After editing commit the code with git add and git commit with suitable message

## Common Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Deploy to Firebase:** `firebase deploy`

## Agent Mandates
*(Add any specific rules you want the agent to always follow here)*
- Always ensure new Firestore queries are supported by appropriate indexes in `firestore.indexes.json` and rules in `firestore.rules`.
- When modifying UI components, ensure responsiveness is maintained.
- Prefer explicit error handling for Firebase operations.
