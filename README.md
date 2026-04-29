# ✨ SoulScript - Your Intelligent Memory Hub

A modern, minimal, and intelligent personal diary application built with **React**, **Vite**, and **Firebase**. SoulScript helps you capture your daily thoughts while providing AI-driven insights, habit tracking, and deep emotional analytics.

![SoulScript Icon](./public/favicon.svg)

## 🌟 Key Features

-   **📖 Beautiful Journaling:** A "futuristic analog" interface designed for focused writing with markdown support.
-   **🤖 AI Soul Insights:** Automatic mood discovery during writing and on-demand daily deep analysis using Gemini AI.
-   **🔒 Zero-Knowledge Security:** Client-side encryption (AES-GCM 256-bit) ensures your private thoughts never leave your device unencrypted.
-   **🎯 Habit Tracking:** Build consistency with integrated habit tracking and streak monitoring.
-   **📈 Emotional Analytics:** Visualize your mood journey with SVG-based trends and well-being scores.
-   **🌓 Dynamic Theming:** Soft Warm Minimal aesthetic with Light, Dark, and System mode support.
-   **🛡️ Admin Dashboard:** Comprehensive management for feedback and user activity stats (restricted access).

## 🛠️ Tech Stack

-   **Frontend:** React 19, Vite, Tailwind CSS (Utility) + Vanilla CSS (Aesthetic)
-   **Backend:** Firebase (Authentication, Firestore, Hosting, Analytics, Remote Config)
-   **AI Integration:** Google Gemini AI (@google/genai)
-   **Security:** Web Crypto API (Client-side AES-GCM)

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
    -   Enable Authentication, Firestore, Remote Config, and Analytics.
    -   Create a `.env` file with your `VITE_FIREBASE_...` configuration keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🎨 Theme & Design
The project uses a custom **Soft Warm Minimal** futuristic aesthetic defined by high-glow accents and deep contrast. 
-   **Mobile First:** Optimized for touch with a responsive FAB and toggleable sidebar.
-   **Desktop Polished:** Spacious layouts with generous padding and persistent navigation.
-   **Mood-Driven:** UI accents subtly shift to reflect the emotional core of your entries.

---
*Capture your story, one spark at a time. ✨*
