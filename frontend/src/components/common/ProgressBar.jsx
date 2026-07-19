function ProgressBar({ progress }) {

  const clamped = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Progress
        </span>

        <span
          className="
            bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
            bg-clip-text text-transparent
            text-xs font-semibold tabular-nums
          "
        >
          {clamped}%
        </span>
      </div>

      <div
        className="
          relative w-full h-3 rounded-full overflow-hidden
          bg-white/50 dark:bg-slate-800/50
          backdrop-blur-sm
          border border-white/25 dark:border-white/10
          shadow-inner
        "
      >
        <div
          className="
            relative h-full rounded-full
            bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500
            shadow-[0_0_10px_rgba(139,92,246,0.55)]
            transition-all duration-700 ease-out
          "
          style={{ width: `${clamped}%` }}
        >
          <div
            className="
              absolute inset-0 rounded-full
              bg-gradient-to-r from-white/30 via-white/10 to-transparent
            "
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;