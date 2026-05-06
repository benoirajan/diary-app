import { useEffect, useState, useRef } from 'react';

export default function LandingPage({ onGetStarted, isDark, themeMode, onThemeChange }) {
  const [typedText, setTypedText] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const fullText = 'elevated by AI.';
  const themeMenuRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);

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

  const features = [
    {
      title: 'AI Soul Insights',
      description: 'Experience real-time mood discovery as you write and on-demand daily deep analysis powered by Gemini AI.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.455L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.455ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-white shadow-cyan-500/50',
      preview: (
        <div className="mt-6 p-4 rounded-2xl bg-[var(--ui-accent-soft)] border border-[var(--ui-accent)]/10 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">✨</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ui-active)]">AI Insight</span>
          </div>
          <div className="h-2 w-3/4 bg-[var(--ui-active)]/20 rounded-full mb-2"></div>
          <div className="h-2 w-full bg-[var(--ui-active)]/20 rounded-full"></div>
        </div>
      )
    },
    {
      title: 'Mood Analytics',
      description: 'Visualize your emotional journey with SVG-based trends, well-being scores, and habit-mood correlations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-white shadow-purple-500/50',
      preview: (
        <div className="mt-6 flex items-end justify-between h-12 gap-1 px-2">
          {[30, 50, 40, 80, 60, 90].map((h, i) => (
            <div key={i} className={`w-full rounded-t-md ${i === 5 ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-[var(--bg-soft)]'}`} style={{ height: `${h}%` }}></div>
          ))}
        </div>
      )
    },
    {
      title: 'Habit Tracking',
      description: 'Build long-term discipline with integrated habit tracking and robust streak monitoring.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-green-500/50',
      preview: (
        <div className="mt-6 flex gap-2">
          {[1, 1, 1, 0].map((v, i) => (
            <div key={i} className={`w-8 h-8 rounded-xl border flex items-center justify-center text-[10px] ${v ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400 font-bold' : 'border-[var(--bg-soft)]'}`}>
              {v ? '✓' : ''}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Zero-Knowledge Security',
      description: 'Your thoughts are yours alone. We use AES-GCM 256-bit client-side encryption to protect your core memories.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 text-white shadow-yellow-500/50',
      preview: (
        <div className="mt-6 p-3 rounded-xl bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)] font-mono text-[8px] opacity-40 break-all select-none">
          U2FsdGVkX1+vGv...9e21...AES-256-GCM
        </div>
      )
    },
    {
      title: 'Rich Markdown',
      description: 'Write with a "futuristic analog" feel using full Markdown support for headers, lists, and deep reflection.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 text-white shadow-rose-500/50',
      preview: (
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--ui-accent)] font-mono">#</span>
            <span className="text-sm font-black text-[var(--text-primary)]">Reflection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--ui-accent)] font-mono">-</span>
            <span className="text-xs text-[var(--text-secondary)]">Deep Flow State</span>
          </div>
        </div>
      )
    },
    {
      title: 'Dynamic Theming',
      description: 'A bespoke "Soft Warm Minimal" aesthetic that adapts perfectly to Light, Dark, or System modes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-500 text-white shadow-gray-500/50',
      preview: (
        <div className="mt-6 flex -space-x-3 group-hover:-space-x-1 transition-all">
          <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[10px]">☀️</div>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px]">🌙</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border border-blue-300 flex items-center justify-center text-[10px]">💻</div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 bg-[var(--bg-main)] text-[var(--text-primary)] font-sans relative overflow-hidden selection:bg-[var(--ui-accent)]/30 ${isDark ? "dark" : ""}`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--ui-accent-soft),transparent_40%)] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.1),transparent_45%)] pointer-events-none opacity-50" />
      <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-[var(--ui-accent)]/10 blur-3xl animate-bounce" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl animate-ping" />

      <style>{`
        .glow-text { text-shadow: 0 0 10px var(--ui-accent), 0 0 25px var(--ui-accent-soft); }
        .glow-border { box-shadow: 0 0 12px var(--ui-accent-soft), 0 0 20px rgba(168, 85, 247, .15); }
        .hover-reveal { transition: all 0.28s ease; }
        .hover-reveal:hover .hidden-text { opacity: 1; transform: translateY(0); }
        .hidden-text { opacity: 0; transform: translateY(10px); transition: all 0.28s ease; }
        .typewriter { border-right: 2px solid var(--ui-accent); animation: caret 1s steps(1) infinite; }
        @keyframes caret { 0%, 50% { border-color: var(--ui-accent); } 51%, 100% { border-color: transparent; } }
        .fade-in { animation: fadeIn 1.8s ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>

      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-20 fade-in">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center glow-border animate-pulse shadow-lg">
            <span className="text-white text-xl">✨</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">SoulScript<span className="text-[var(--ui-accent)]">.</span></span>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="relative" ref={themeMenuRef}>
                <button
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all border border-[var(--bg-soft)]"
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
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
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

            <button
                onClick={onGetStarted}
                className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-[var(--bg-soft)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)] transition-all shadow-sm hover:shadow-[var(--ui-accent)]/20"
            >
                Sign In
            </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 text-center relative z-10 fade-in">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[var(--ui-accent-soft)] text-[var(--ui-active)] text-[10px] font-black uppercase tracking-widest animate-pulse border border-[var(--ui-accent)]/10">
          Your personal growth companion
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8 max-w-4xl mx-auto text-[var(--text-primary)]">
          Your thoughts, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 typewriter">
            {typedText}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          A futuristic dashboard for your daily reflections. Capture your story, review your mood map, track habits, and let AI surface meaningful patterns.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-lg hover:scale-105 transition-all shadow-xl shadow-cyan-500/40 active:scale-95"
          >
            Start Your Journey
          </button>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Free to use. Private by design.</p>
        </div>

        {/* Live Product Showcase */}
        <div className="mt-20 relative mx-auto max-w-5xl group">
          <div className="absolute -inset-10 bg-gradient-to-r from-cyan-400/20 via-blue-500/10 to-purple-500/20 rounded-[60px] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></div>
          
          <div className="relative aspect-[16/10] md:aspect-video w-full perspective-1000">
            {/* Background Layer - Main App Frame */}
            <div className="absolute inset-0 bg-[var(--bg-card)] rounded-[32px] border border-[var(--bg-soft)] shadow-2xl overflow-hidden flex flex-col glow-border opacity-40 scale-95 translate-z-[-50px]">
              <div className="h-10 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/30 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/30"></div>
              </div>
              <div className="flex-1 p-8">
                <div className="w-48 h-8 bg-[var(--bg-soft)] rounded-lg mb-8"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-[var(--bg-soft)]/50 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Layer - Entry List Mockup */}
            <div className="absolute top-[10%] left-[5%] w-[45%] bg-[var(--bg-card)] rounded-[24px] border border-[var(--bg-soft)] shadow-2xl overflow-hidden hidden md:flex flex-col glow-border animate-float-slow transform rotate-Y-10 rotate-X-5">
              <div className="p-4 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/20 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 text-[var(--text-primary)]">Recent Entries</span>
                <div className="flex gap-1">
                  <div className="w-4 h-1 bg-[var(--ui-accent)] rounded-full"></div>
                  <div className="w-2 h-1 bg-[var(--bg-soft)] rounded-full"></div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { title: "The Flow State", mood: "Radiant", color: "text-orange-400" },
                  { title: "Midnight Reflections", mood: "Peaceful", color: "text-blue-400" },
                  { title: "Overcoming Hurdles", mood: "Growing", color: "text-emerald-400" }
                ].map((entry, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--bg-soft)] flex items-center justify-between group/item hover:border-[var(--ui-accent)]/30 transition-all">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-[var(--text-primary)]">{entry.title}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${entry.color}`}>{entry.mood}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-[var(--text-secondary)] opacity-30">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Layer - Analytics & AI Insight */}
            <div className="absolute top-[5%] right-[5%] w-[55%] md:w-[48%] bg-[var(--bg-card)]/90 backdrop-blur-xl rounded-[28px] border border-[var(--ui-accent)]/20 shadow-2xl overflow-hidden flex flex-col glow-border animate-float transform rotate-Y-[-10] rotate-X-[-5]">
              <div className="p-5 border-b border-[var(--bg-soft)] bg-gradient-to-r from-[var(--ui-accent-soft)] to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">✨</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ui-active)]">Soul Insight</span>
                </div>
                <div className="text-xs font-bold text-[var(--text-primary)]">“You’re more consistent when you write at night.”</div>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Mock Chart */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-[var(--text-primary)]">Mood Trend</span>
                    <span className="text-[10px] font-bold text-emerald-400">+12% vs last week</span>
                  </div>
                  <div className="h-24 w-full flex items-end gap-1.5 px-1">
                    {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 group/bar relative">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 ${i === 5 ? 'bg-[var(--ui-accent)] shadow-[0_0_15px_var(--ui-accent-soft)]' : 'bg-[var(--bg-soft)] hover:bg-[var(--ui-accent-soft)]'}`} 
                          style={{ height: `${h}%` }}
                        ></div>
                        {i === 5 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] border border-[var(--ui-accent)]/30 px-2 py-0.5 rounded text-[8px] font-black text-[var(--ui-active)] whitespace-nowrap">
                            Radiant Day
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)]">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1 text-[var(--text-primary)]">Streak</div>
                    <div className="text-lg font-black text-[var(--text-primary)] flex items-center gap-1.5">
                      14 <span className="text-xs">🔥</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--bg-soft)]">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1 text-[var(--text-primary)]">Well-being</div>
                    <div className="text-lg font-black text-[var(--text-primary)]">88%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-[15%] left-[15%] bg-[var(--bg-card)] px-4 py-2.5 rounded-2xl shadow-2xl border border-yellow-400/30 animate-pulse hidden lg:flex items-center gap-2 rotate-[-5deg]">
              <span className="text-xs">🔒</span>
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-primary)]">AES-GCM Protected</span>
            </div>
          </div>
        </div>

        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .rotate-Y-10 { transform: rotateY(10deg); }
          .rotate-Y-[-10] { transform: rotateY(-10deg); }
          .rotate-X-5 { transform: rotateX(5deg); }
          .rotate-X-[-5] { transform: rotateX(-5deg); }
          .translate-z-[-50px] { transform: translateZ(-50px); }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotateY(-10deg) rotateX(-5deg); }
            50% { transform: translateY(-15px) rotateY(-12deg) rotateX(-6deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotateY(10deg) rotateX(5deg); }
            50% { transform: translateY(-10px) rotateY(12deg) rotateX(6deg); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        `}</style>
      </main>

      <section className="bg-[var(--bg-card)] py-24 border-t border-[var(--bg-soft)] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 tracking-tight text-[var(--text-primary)]">Everything you need to reflect.</h2>
            <p className="text-[var(--text-secondary)] font-medium">Simple on the outside, powerful on the inside.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)]/30 transition-all group hover-reveal shadow-sm flex flex-col">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-[var(--text-primary)] tracking-tight">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium mb-auto">{feature.description}</p>
                
                {/* Feature Live Preview */}
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  {feature.preview}
                </div>

                <div className="hidden-text mt-6 text-[10px] font-black text-[var(--ui-accent)] uppercase tracking-widest">Discover more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-[var(--bg-soft)] text-center relative z-10 bg-[var(--bg-main)]">
        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">© 2026 SoulScript. Built for thoughtful reflection.</p>
      </footer>
    </div>
  );
}
