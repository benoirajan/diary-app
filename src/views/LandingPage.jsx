import { useEffect, useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'elevated by AI.';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'AI Reflections',
      description:
        'Gain deeper insights into your thoughts with intelligent summaries and affirmations powered by Gemini AI.',
      icon: '✨',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-white shadow-cyan-500/50'
    },
    {
      title: 'Mood Mapping',
      description:
        'Track your emotional journey with expressive moods and visualize your growth over time.',
      icon: '🌈',
      color: 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-white shadow-purple-500/50'
    },
    {
      title: 'Rich Expression',
      description:
        'Write with style using full Markdown support. Add headers, lists, and quotes to your memories.',
      icon: '✍️',
      color: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-green-500/50'
    },
    {
      title: 'Privacy First',
      description:
        'Your thoughts are personal. We use secure authentication and encrypted storage to keep your data safe.',
      icon: '🔒',
      color: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 text-white shadow-yellow-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-white font-sans relative overflow-hidden selection:bg-cyan-600/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.18),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.14),transparent_45%)] pointer-events-none" />
      <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-cyan-500/20 blur-3xl animate-bounce" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500/25 blur-3xl animate-ping" />

      <style>{`
        .glow-text { text-shadow: 0 0 10px #22d3ee, 0 0 25px #22d3ee; }
        .glow-border { box-shadow: 0 0 12px rgba(34, 211, 238, .5), 0 0 20px rgba(168, 85, 247, .35); }
        .hover-reveal { transition: all 0.28s ease; }
        .hover-reveal:hover .hidden-text { opacity: 1; transform: translateY(0); }
        .hidden-text { opacity: 0; transform: translateY(10px); transition: all 0.28s ease; }
        .typewriter { border-right: 2px solid #22d3ee; animation: caret 1s steps(1) infinite; }
        @keyframes caret { 0%, 50% { border-color: #22d3ee; } 51%, 100% { border-color: transparent; } }
        .fade-in { animation: fadeIn 1.8s ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>

      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10 fade-in">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center glow-border animate-pulse">
            <span className="text-white text-xl">✨</span>
          </div>
          <span className="text-2xl font-black tracking-tighter glow-text">AI Diary<span className="text-cyan-400">.</span></span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-800 border border-gray-700 hover:border-cyan-400 transition-all shadow-sm hover:shadow-cyan-500/40"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 text-center relative z-10 fade-in">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          Your personal growth companion
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8 max-w-4xl mx-auto glow-text">
          Your thoughts, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 typewriter">
            {typedText}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          A futuristic dashboard for your daily reflections. Capture your story, review your mood map, and let AI surface meaningful patterns.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-lg hover:scale-105 transition-all shadow-xl shadow-cyan-500/40 active:scale-95"
          >
            <span className="hidden sm:inline">Start Your Journey</span>
            <span className="sm:hidden">Get Started</span>
          </button>
          <p className="text-sm text-slate-400 font-medium">Free to use. Private by design.</p>
        </div>

        <div className="mt-20 relative mx-auto max-w-5xl group hover-reveal">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300/20 to-purple-300/20 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
          <div className="relative bg-slate-900 rounded-[32px] border border-slate-700 shadow-2xl overflow-hidden aspect-video flex flex-col glow-border">
            <div className="h-10 border-b border-slate-700 bg-slate-800/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 p-8 text-left relative">
              <div className="max-w-2xl mx-auto space-y-6 opacity-40">
                <div className="h-8 w-1/3 bg-slate-700 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-700 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
                <div className="h-40 w-full bg-slate-700 rounded-2xl"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-cyan-400 max-w-xs rotate-2 scale-110 glow-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-cyan-400 text-black rounded-full text-[10px] font-bold">HAPPY</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">APR 3, 2026</span>
                </div>
                <div className="text-sm font-bold text-white mb-2">A productive, inspired morning...</div>
                <div className="text-xs text-slate-400 leading-relaxed">AI-guided reflection helped me spot the emotional pattern in my day and improve focus for the next session.</div>
                <div className="hidden-text mt-4 text-xs text-cyan-300">
                  Hover to reveal: insights are now ready with mood-based suggestions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-slate-900 py-24 border-t border-slate-700 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 tracking-tight glow-text">Everything you need to reflect.</h2>
            <p className="text-slate-300 font-medium">Simple on the outside, powerful on the inside.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-slate-800/50 hover:bg-slate-800 hover:glow-border transition-all group hover-reveal">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform glow-border`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{feature.description}</p>
                <div className="hidden-text mt-4 text-xs text-cyan-300">Discover more: {feature.title} integrates seamlessly with your diary experience.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-700 text-center relative z-10">
        <p className="text-sm text-slate-400 font-medium glow-text">© 2026 AI Diary. Built for thoughtful reflection.</p>
      </footer>
    </div>
  );
}
