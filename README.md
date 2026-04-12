# ✨ SoulScript - Your Intelligent Memory Hub

A modern, minimal, and intelligent personal diary application built with **React**, **Vite**, and **Firebase**. SoulScript helps you capture your daily thoughts while providing AI-driven insights and mood-based reflections.

![SoulScript Icon](./public/favicon.svg)

## 🌟 Key Features

-   **📖 Beautiful Journaling:** A clean, "soft warm minimal" interface designed for focused writing.
-   **🤖 AI Insights:** Generate personalized affirmations and reflections on your entries using Gemini AI.
-   **🌈 Mood Tracking:** Categorize your memories with expressive moods (Happy, Calm, Excited, etc.) and see them visualized.
-   **🌓 Dark Mode:** A fully themed dark mode for comfortable late-night reflection.
-   **🔒 Secure & Private:** Powered by Firebase Authentication and Firestore to keep your memories safe and synced.
-   **📊 Analytics:** (In Progress) View trends in your moods and writing habits over time.

## 🛠️ Tech Stack

-   **Frontend:** React 19, Vite, Tailwind CSS
-   **Backend:** Firebase (Authentication, Firestore)
-   **Styling:** Custom CSS Variables + Tailwind for a bespoke minimal aesthetic
-   **AI Integration:** Google Gemini API

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd my-diary-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    -   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
    -   Enable Authentication (Email/Password) and Firestore.
    -   Create a `.env` file (or update `src/firebase.js`) with your Firebase configuration.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🎨 Theme & Design
The project uses a custom **Soft Warm Minimal** theme defined in `src/index.css`. It relies on CSS variables for easy theming:
-   `--bg-main`: Soft off-white for a paper-like feel.
-   `--accent-happy`: Warm amber for primary actions.
-   Custom mood colors for a vibrant yet cohesive list view.

---
*Capture your story, one spark at a time. ✨*
