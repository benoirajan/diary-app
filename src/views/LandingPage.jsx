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
      description:
        'Experience real-time mood discovery as you write and on-demand daily deep analysis powered by Gemini AI.',
      icon: '✨',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-white shadow-cyan-500/50'
    },
    {
      title: 'Mood Analytics',
      description:
        'Visualize your emotional journey with SVG-based trends, well-being scores, and habit-mood correlations.',
      icon: '📈',
      color: 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-white shadow-purple-500/50'
    },
    {
      title: 'Habit Tracking',
      description:
        'Build long-term discipline with integrated habit tracking and robust streak monitoring.',
      icon: '🎯',
      color: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-green-500/50'
    },
    {
      title: 'Zero-Knowledge Security',
      description:
        'Your thoughts are yours alone. We use AES-GCM 256-bit client-side encryption to protect your core memories.',
      icon: '🔒',
      color: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 text-white shadow-yellow-500/50'
    },
    {
      title: 'Rich Markdown',
      description:
        'Write with a "futuristic analog" feel using full Markdown support for headers, lists, and deep reflection.',
      icon: '✍️',
      color: 'bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 text-white shadow-rose-500/50'
    },
    {
      title: 'Dynamic Theming',
      description:
        'A bespoke "Soft Warm Minimal" aesthetic that adapts perfectly to Light, Dark, or System modes.',
      icon: '🌓',
      color: 'bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-500 text-white shadow-gray-500/50'
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

        {/* Browser Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl group hover-reveal">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
          <div className="relative bg-[var(--bg-card)] rounded-[32px] border border-[var(--bg-soft)] shadow-2xl overflow-hidden aspect-video flex flex-col glow-border">
            <div className="h-10 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
            </div>
            <div className="flex-1 p-8 text-left relative">
              <div className="max-w-2xl mx-auto space-y-6 opacity-20">
                <div className="h-8 w-1/3 bg-[var(--text-secondary)] rounded-lg"></div>
                <div className="h-4 w-full bg-[var(--text-secondary)] rounded-md"></div>
                <div className="h-4 w-5/6 bg-[var(--text-secondary)] rounded-md"></div>
                <div className="h-40 w-full bg-[var(--text-secondary)] rounded-2xl"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-card)]/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-[var(--ui-accent)]/30 max-w-xs rotate-2 scale-110 glow-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[var(--ui-accent-soft)] text-[var(--ui-active)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--ui-accent)]/20">JOYFUL</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">APR 29, 2026</span>
                </div>
                <div className="text-sm font-black text-[var(--text-primary)] mb-2">A focused, flow-state session...</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">AI-guided reflection helped me connect my productivity with my morning meditation habit. Well-being score is up!</div>
                <div className="hidden-text mt-4 text-[10px] font-black text-[var(--ui-accent)] uppercase tracking-widest">
                  Personal Growth Unlocked ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[var(--bg-card)] py-24 border-t border-[var(--bg-soft)] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 tracking-tight text-[var(--text-primary)]">Everything you need to reflect.</h2>
            <p className="text-[var(--text-secondary)] font-medium">Simple on the outside, powerful on the inside.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--ui-accent)]/30 transition-all group hover-reveal shadow-sm">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-[var(--text-primary)] tracking-tight">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{feature.description}</p>
                <div className="hidden-text mt-4 text-[10px] font-black text-[var(--ui-accent)] uppercase tracking-widest">Discover more →</div>
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
