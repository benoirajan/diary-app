const AnalyticsHeader = ({ smartMessages }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide drop-shadow-[0_0_5px_var(--glow-color)]">
          📊 Analytics Dashboard
      </h2>

      {smartMessages.length > 0 && (
          <div className="flex flex-col gap-2">
              {smartMessages.slice(0, 2).map((msg, i) => (
                  <div key={i} className="px-4 py-2 rounded-xl bg-[var(--accent-happy)]/10 border border-[var(--accent-happy)]/20 text-[var(--accent-happy)] text-sm font-bold animate-in slide-in-from-right-4 duration-500 delay-75">
                      {msg}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default AnalyticsHeader;
