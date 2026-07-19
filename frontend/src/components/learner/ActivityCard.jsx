import { Activity, CheckCircle2, XCircle } from "lucide-react";

function ActivityCard({

    recentResults

}) {

    return (

        <div
            className="
                relative overflow-hidden
                rounded-2xl p-6
                bg-white/65 dark:bg-slate-900/50
                backdrop-blur-xl
                border border-white/25 dark:border-white/10
                shadow-[0_1px_2px_rgba(15,23,42,0.06)]
            "
        >

            <div className="mb-5 flex items-center gap-2">

                <div
                    className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg
                        bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10
                        border border-white/40 dark:border-white/10
                    "
                >
                    <Activity className="h-4 w-4 text-indigo-600" />
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Recent Activity
                </h2>

            </div>

            {

                recentResults.length === 0 ? (

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No recent activity available.
                    </p>

                ) : (

                    <div className="relative space-y-1">

                        {/* Timeline accent line */}
                        <div
                            className="
                                pointer-events-none absolute left-[15px] top-2 bottom-2 w-px
                                bg-gradient-to-b from-indigo-400/50 via-violet-400/30 to-transparent
                            "
                        />

                        {

                            recentResults.map((result) => (

                                <div
                                    key={result.id}
                                    className="
                                        group relative flex items-start gap-3
                                        rounded-xl p-3
                                        transition-all duration-300 ease-out
                                        hover:bg-white/60 dark:hover:bg-white/5
                                        hover:shadow-[0_4px_16px_-4px_rgba(79,70,229,0.25)]
                                    "
                                >

                                    <span
                                        className={`
                                            relative z-10 flex h-8 w-8 shrink-0 items-center justify-center
                                            rounded-full
                                            border
                                            transition-transform duration-300 ease-out
                                            group-hover:scale-110
                                            ${
                                                result.passed
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                                    : "bg-rose-500/10 border-rose-500/30 text-rose-600"
                                            }
                                        `}
                                    >

                                        {

                                            result.passed
                                                ? <CheckCircle2 className="h-4 w-4" />
                                                : <XCircle className="h-4 w-4" />

                                        }

                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">

                                            <p className="font-medium text-slate-800 dark:text-slate-100">

                                                {

                                                    result.passed

                                                        ? "Assessment Passed"

                                                        : "Assessment Attempted"

                                                }

                                            </p>

                                            <span
                                                className={`
                                                    rounded-full px-2.5 py-0.5 text-xs font-semibold
                                                    border
                                                    ${
                                                        result.passed
                                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                                    }
                                                `}
                                            >
                                                {result.passed ? "Passed" : "Failed"}
                                            </span>

                                        </div>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">

                                            Score:{" "}

                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {result.percentage}%
                                            </span>

                                        </p>

                                        {result.timestamp && (
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                {result.timestamp}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default ActivityCard;