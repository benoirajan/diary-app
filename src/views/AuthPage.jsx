import { useState, useRef, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendEmailVerification 
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthPage({ onBack, isDark, themeMode, onThemeChange, needsVerification }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
            setShowThemeMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    { label: "Light", value: "light", icon: "☀️" },
    { label: "Dark", value: "dark", icon: "🌙" },
    { label: "System", value: "system", icon: "💻" },
  ];

  const currentThemeOption = themeOptions.find(opt => opt.value === themeMode) || themeOptions[2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setError("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleReloadUser = async () => {
    setError("");
    setLoading(true);
    try {
      await auth.currentUser.reload();
      // The AuthContext will automatically update based on the new verification status
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 bg-[var(--bg-main)] text-[var(--text-primary)] font-sans flex items-center justify-center p-6 relative overflow-hidden ${isDark ? "dark" : ""}`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,var(--ui-accent-soft),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)] opacity-50" />
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        {onBack ? (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <span className="text-lg">←</span> Back
          </button>
        ) : <div />}

        {/* Theme Selector */}
        <div className="relative" ref={themeMenuRef}>
            <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all border border-[var(--bg-soft)]"
            >
                <span className="text-lg">{currentThemeOption.icon}</span>
                <span className="text-xs hidden sm:inline">{currentThemeOption.label}</span>
            </button>

            {showThemeMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--bg-card)] border border-[var(--bg-soft)] rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                    {themeOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onThemeChange(opt.value);
                                setShowThemeMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                themeMode === opt.value
                                    ? "bg-[var(--ui-accent-soft)] text-[var(--ui-active)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]"
                            }`}
                        >
                            <span className="text-lg">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--bg-soft)] shadow-2xl p-8 md:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/20">
            <span className="text-white text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
            {needsVerification ? "Verify Your Email" : isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">
            {needsVerification 
              ? "Please check your email and click the verification link to continue." 
              : isRegistering 
                ? "Start your personal SoulScript journey today." 
                : "Your thoughts are waiting for you."}
          </p>
        </div>

        {needsVerification ? (
          <div className="space-y-6">
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-bold rounded-2xl text-center">
              <div className="text-2xl mb-2">📧</div>
              We've sent a verification email to <strong>{auth.currentUser?.email}</strong>.<br />
              Please click the link in the email to verify your account.
            </div>

            <button
              onClick={handleReloadUser}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Checking..." : "I've Verified My Email"}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full py-4 bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-soft)] transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  auth.signOut();
                  setVerificationSent(false);
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--ui-accent)] text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : verificationSent ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-bold rounded-2xl text-center">
              <div className="text-2xl mb-2">📧</div>
              Verification email sent to <strong>{email}</strong>!<br />
              Please check your inbox and click the verification link to activate your account.
            </div>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full py-4 bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-soft)] transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>

            <button
              onClick={() => {
                setVerificationSent(false);
                setIsRegistering(false);
              }}
              className="w-full py-4 bg-transparent border border-[var(--bg-soft)] text-[var(--text-secondary)] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-soft)] transition-all active:scale-[0.98]"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
        <div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-soft)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-1.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--bg-soft)]"></span>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="bg-[var(--bg-card)] px-4 text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full px-6 py-4 bg-[var(--bg-soft)] border border-transparent focus:border-[var(--ui-accent)]/30 rounded-2xl transition-all outline-none text-[var(--text-primary)] font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] px-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-[var(--bg-soft)] border border-transparent focus:border-[var(--ui-accent)]/30 rounded-2xl transition-all outline-none text-[var(--text-primary)] font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
          >
            {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[var(--text-secondary)] hover:text-[var(--ui-accent)] text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {isRegistering 
              ? "Already have an account? Sign In" 
              : "Don't have an account? Create Account"}
          </button>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
