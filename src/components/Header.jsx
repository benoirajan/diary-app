import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header = ({
    title = "My Diary",
    isDarkMode = false,
    onToggleDarkMode,
    onPrimaryAction,
    primaryActionLabel = "",
  }) => {
    return (
      <header className="flex justify-between items-center mb-10">
        {/* Left Side - Title */}
        <h1 className="text-3xl font-semibold tracking-tight">
          {title}
        </h1>
  
        {/* Right Side - Actions */}
        <div className="flex items-center gap-4">
          {/* Optional Primary Button */}
          {onPrimaryAction && primaryActionLabel && (
            <button
              onClick={onPrimaryAction}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {primaryActionLabel}
            </button>
          )}
  
          <button onClick={() => signOut(auth)}>
                    Sign Out
                </button>
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="px-3 py-2 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </header>
    );
  };
  
  export default Header;