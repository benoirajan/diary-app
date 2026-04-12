import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-[#03040a] via-[#070b1e] to-[#0f132e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.2),transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,.2),transparent_50%)]" />
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-sm font-bold text-slate-300 hover:text-cyan-300 transition-colors z-10"
        >
          ← Back
        </button>
      )}
      <div className="w-full max-w-md bg-gradient-to-t from-[#0d1223] to-[#161b33] rounded-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,.25)] p-8 md:p-10 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,.6)]">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-300">
            {isRegistering 
              ? "Start your personal AI diary journey today." 
              : "Your thoughts are waiting for you."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 px-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full px-5 py-4 bg-[var(--bg-soft)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent-happy)] transition-all outline-none text-[var(--text-primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-[var(--bg-soft)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent-happy)] transition-all outline-none text-[var(--text-primary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(34,211,238,.45)] hover:shadow-[0_0_30px_rgba(34,211,238,.65)] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Processing..." : isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#11162b] px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-slate-300 hover:text-cyan-300 text-sm font-medium transition-all"
          >
            <span className="hidden sm:inline">
              {isRegistering 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Sign Up"}
            </span>
            <span className="sm:hidden">
              {isRegistering ? "Sign In" : "Sign Up"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}