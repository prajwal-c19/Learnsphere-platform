function StatCard({ title, value, icon, subtitle, trend }) {

  const isPositiveTrend = typeof trend === "number" ? trend >= 0 : trend?.startsWith?.("+");

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl p-6
        bg-white/65 dark:bg-slate-900/50
        backdrop-blur-xl
        border border-white/25 dark:border-white/10
        shadow-[0_1px_2px_rgba(15,23,42,0.06)]
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        hover:shadow-[0_12px_32px_-8px_rgba(79,70,229,0.35)]
        hover:border-indigo-400/40
      "
    >
      {/* Glow border on hover */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl opacity-0
          bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-purple-500/15
          transition-opacity duration-300 ease-out
          group-hover:opacity-100
        "
      />

      <div className="relative flex items-start justify-between">
        <div
          className="
            flex h-12 w-12 items-center justify-center
            rounded-xl text-2xl
            bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10
            border border-white/40 dark:border-white/10
            shadow-inner
            transition-transform duration-300 ease-out
            group-hover:scale-105
          "
        >
          {icon}
        </div>

        {trend !== undefined && trend !== null && (
          <span
            className={`
              inline-flex items-center gap-1 rounded-full px-2.5 py-1
              text-xs font-semibold
              transition-colors duration-300
              ${isPositiveTrend
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 border border-rose-500/20"}
            `}
          >
            {isPositiveTrend ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <h2
          className="
            bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
            bg-clip-text text-transparent
            text-3xl font-bold tracking-tight
            transition-all duration-300 ease-out
            group-hover:from-indigo-500 group-hover:via-violet-500 group-hover:to-purple-500
          "
        >
          {value}
        </h2>
      </div>

      <div className="relative mt-2 space-y-0.5">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {title}
        </p>

        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;