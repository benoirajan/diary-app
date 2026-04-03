export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      title: "AI Reflections",
      description: "Gain deeper insights into your thoughts with intelligent summaries and affirmations powered by Gemini AI.",
      icon: "✨",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Mood Mapping",
      description: "Track your emotional journey with expressive moods and visualize your growth over time.",
      icon: "🌈",
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Rich Expression",
      description: "Write with style using full Markdown support. Add headers, lists, and quotes to your memories.",
      icon: "✍️",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Privacy First",
      description: "Your thoughts are personal. We use secure authentication and encrypted storage to keep your data safe.",
      icon: "🔒",
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-happy)]/30">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--accent-happy)] rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
             <span className="text-white text-xl">✨</span>
          </div>
          <span className="text-2xl font-black tracking-tighter">AI Diary<span className="text-[var(--accent-happy)]">.</span></span>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[var(--bg-card)] border border-[var(--bg-soft)] hover:border-[var(--accent-happy)] transition-all shadow-sm"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[var(--accent-happy)]/10 text-[var(--accent-happy)] text-xs font-bold uppercase tracking-widest animate-pulse">
          Your personal growth companion
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
          Your thoughts, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-happy)] to-amber-600">elevated by AI.</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          A minimal, beautiful space for your daily reflections. Capture your story and let intelligence help you understand your journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-lg hover:scale-105 transition-all shadow-xl shadow-amber-200/50 active:scale-95"
          >
            Start Your Journey
          </button>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Free to use. Private by design.</p>
        </div>

        {/* Browser Mockup / Visual */}
        <div className="mt-20 relative mx-auto max-w-5xl group">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-100 to-purple-100 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
            <div className="relative bg-[var(--bg-card)] rounded-[32px] border border-[var(--bg-soft)] shadow-2xl overflow-hidden aspect-video flex flex-col">
                {/* Mockup Header */}
                <div className="h-10 border-b border-[var(--bg-soft)] bg-[var(--bg-soft)]/30 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-300"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                    <div className="w-3 h-3 rounded-full bg-green-300"></div>
                </div>
                {/* Mockup Content */}
                <div className="flex-1 p-8 text-left">
                    <div className="max-w-2xl mx-auto space-y-6 opacity-40">
                        <div className="h-8 w-1/3 bg-[var(--bg-soft)] rounded-lg"></div>
                        <div className="h-4 w-full bg-[var(--bg-soft)] rounded-md"></div>
                        <div className="h-4 w-5/6 bg-[var(--bg-soft)] rounded-md"></div>
                        <div className="h-40 w-full bg-[var(--bg-soft)] rounded-2xl"></div>
                    </div>
                    {/* Floating Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white max-w-xs rotate-2 scale-110">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-amber-400 text-white rounded-full text-[10px] font-bold">HAPPY</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">MARCH 14, 2026</span>
                        </div>
                        <div className="text-sm font-bold text-gray-800 mb-2">A beautiful productive morning...</div>
                        <div className="text-xs text-gray-500 leading-relaxed">Today I finally finished the project. The AI helped me reflect on how far I've come this month.</div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-[var(--bg-card)] py-24 border-t border-[var(--bg-soft)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 tracking-tight">Everything you need to reflect.</h2>
            <p className="text-[var(--text-secondary)] font-medium">Simple on the outside, powerful on the inside.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-[var(--bg-soft)]/40 hover:bg-[var(--bg-soft)] transition-all group">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--bg-soft)] text-center">
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          © 2026 AI Diary. Built for thoughtful reflection.
        </p>
      </footer>
    </div>
  );
}
