import {

    Crown,

    Trophy,

    Flame,

    Sparkles,

} from "lucide-react";

function getInitials(name) {

    if (!name) {

        return "?";

    }

    return name

        .trim()

        .split(" ")

        .filter(Boolean)

        .slice(0, 2)

        .map((part) => part[0].toUpperCase())

        .join("");

}

const RANK_THEME = {

    1: {

        label: "Gold",

        text: "text-yellow-400",

        ring: "ring-yellow-400/70",

        chip: "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900",

        borderGradient: "from-yellow-300 via-amber-400/70 to-yellow-200/20",

        glow: "bg-yellow-400/40",

        xpText: "text-yellow-300",

    },

    2: {

        label: "Silver",

        text: "text-slate-300",

        ring: "ring-slate-300/60",

        chip: "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900",

        borderGradient: "from-slate-200 via-slate-400/60 to-slate-300/10",

        glow: "bg-slate-300/25",

        xpText: "text-slate-200",

    },

    3: {

        label: "Bronze",

        text: "text-amber-500",

        ring: "ring-amber-600/60",

        chip: "bg-gradient-to-r from-amber-500 to-orange-700 text-white",

        borderGradient: "from-amber-500 via-orange-600/60 to-amber-700/10",

        glow: "bg-amber-600/25",

        xpText: "text-amber-400",

    },

};

/* ==========================================
    Gamification badge definitions
========================================== */

const BADGE_DEFS = {

    topLearner: {

        emoji: "🏆",

        label: "Top Learner",

        classes: "bg-yellow-400/15 border-yellow-400/40 text-yellow-300",

    },

    onFire: {

        emoji: "🔥",

        label: "On Fire",

        classes: "bg-orange-500/15 border-orange-500/40 text-orange-300",

    },

    risingStar: {

        emoji: "⭐",

        label: "Rising Star",

        classes: "bg-purple-400/15 border-purple-400/40 text-purple-300",

    },

    quizMaster: {

        emoji: "🎯",

        label: "Quiz Master",

        classes: "bg-cyan-400/15 border-cyan-400/40 text-cyan-300",

    },

    courseChampion: {

        emoji: "📚",

        label: "Course Champion",

        classes: "bg-indigo-400/15 border-indigo-400/40 text-indigo-300",

    },

};

/**
 * Computes which gamification badges each learner has earned,
 * purely from the leaderboard data already provided as props.
 * Returns a Map of entry.id -> array of badge keys.
 */
function computeBadges(leaderboard) {

    const badgeMap = new Map();

    if (!leaderboard || leaderboard.length === 0) {

        return badgeMap;

    }

    const maxCourses = Math.max(
        ...leaderboard.map((entry) => entry.completed_courses ?? 0)
    );

    const maxAssessments = Math.max(
        ...leaderboard.map((entry) => entry.completed_assessments ?? 0)
    );

    const maxProgress = Math.max(
        ...leaderboard.map((entry) => entry.progress ?? 0)
    );

    const nonPodium = leaderboard.filter((entry) => (entry.rank ?? 0) > 3);

    const risingStar = nonPodium.reduce((best, entry) => {

        if (!best) {

            return entry;

        }

        return (entry.xp ?? 0) > (best.xp ?? 0) ? entry : best;

    }, null);

    leaderboard.forEach((entry) => {

        const badges = [];

        if (entry.rank === 1) {

            badges.push("topLearner");

        }

        if (maxProgress > 0 && (entry.progress ?? 0) === maxProgress) {

            badges.push("onFire");

        }

        if (
            maxAssessments > 0
            && (entry.completed_assessments ?? 0) === maxAssessments
        ) {

            badges.push("quizMaster");

        }

        if (maxCourses > 0 && (entry.completed_courses ?? 0) === maxCourses) {

            badges.push("courseChampion");

        }

        if (risingStar && entry.id === risingStar.id) {

            badges.push("risingStar");

        }

        badgeMap.set(entry.id, badges);

    });

    return badgeMap;

}

function BadgeChip({

    badgeKey,

    size = "sm",

}) {

    const def = BADGE_DEFS[badgeKey];

    if (!def) {

        return null;

    }

    const sizing =
        size === "sm"
            ? "text-[10px] px-2 py-0.5 gap-1"
            : "text-xs px-2.5 py-1 gap-1.5";

    return (

        <span

            title={def.label}

            className={`lb-badge-pop inline-flex items-center ${sizing} rounded-full border font-semibold whitespace-nowrap ${def.classes}`}

        >

            <span className="leading-none">{def.emoji}</span>

            {

                size !== "icon" && (

                    <span className="leading-none">{def.label}</span>

                )

            }

        </span>

    );

}

function Avatar({

    name,

    avatar,

    size = 64,

    ringClass = "ring-2 ring-white/10",

}) {

    return (

        <div

            className={`rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 ring-offset-2 ring-offset-slate-900 ${ringClass}`}

            style={{
                width: size,
                height: size,
                fontSize: size / 2.6,
            }}

        >

            {

                avatar
                    ? (

                        <img

                            src={avatar}

                            alt={name}

                            className="w-full h-full object-cover"

                        />

                    )
                    : (

                        getInitials(name)

                    )

            }

        </div>

    );

}

function ProgressBar({

    value,

    trackClass = "h-2 w-24",

}) {

    const clamped = Math.min(Math.max(value ?? 0, 0), 100);

    return (

        <div className={`relative bg-white/10 rounded-full overflow-hidden ${trackClass}`}>

            <div

                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-700 relative overflow-hidden"

                style={{
                    width: `${clamped}%`,
                }}

            >

                <span className="absolute inset-0 bg-white/20 animate-pulse" />

            </div>

        </div>

    );

}

function PodiumCard({

    entry,

    place,

    badges,

    isCurrentLearner,

}) {

    const theme = RANK_THEME[place];

    const layout = {

        1: {

            mobileOrder: "order-1 sm:order-2",

            avatarSize: 92,

            crownSize: 36,

            scale: "sm:scale-105",

            width: "w-full sm:w-auto sm:flex-1",

        },

        2: {

            mobileOrder: "order-2 sm:order-1",

            avatarSize: 74,

            crownSize: 26,

            scale: "",

            width: "w-full sm:w-auto sm:flex-1",

        },

        3: {

            mobileOrder: "order-3 sm:order-3",

            avatarSize: 70,

            crownSize: 26,

            scale: "",

            width: "w-full sm:w-auto sm:flex-1",

        },

    }[place];

    if (!entry) {

        return (

            <div className={`${layout.mobileOrder} ${layout.width} hidden sm:block`} />

        );

    }

    return (

        <div

            className={`${layout.mobileOrder} ${layout.width} ${layout.scale} relative transition-transform duration-300`}

        >

            {/* ==========================================
                Glow (Rank 1 gets the strongest glow)
            ========================================== */}

            <div

                className={`absolute -inset-3 sm:-inset-4 rounded-[2rem] blur-2xl ${theme.glow} ${
                    place === 1 ? "opacity-80 animate-pulse" : "opacity-40"
                }`}

            />

            {/* ==========================================
                Gradient border wrapper
            ========================================== */}

            <div

                className={`relative p-[1.5px] rounded-3xl bg-gradient-to-br ${theme.borderGradient} group ${
                    isCurrentLearner ? "lb-current-glow" : ""
                }`}

            >

                <div

                    className={`relative bg-white/[0.06] backdrop-blur-xl rounded-[calc(1.5rem-1.5px)] px-5 sm:px-6 text-center overflow-hidden group-hover:bg-white/[0.1] group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-300 ${
                        isCurrentLearner ? "ring-2 ring-indigo-400/70" : ""
                    }`}

                    style={{
                        paddingTop: place === 1 ? "1.5rem" : "1.75rem",
                        paddingBottom: place === 1 ? "2.25rem" : "1.5rem",
                    }}

                >

                    {

                        isCurrentLearner && (

                            <span className="absolute top-3 right-3 text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full shadow-md">

                                You

                            </span>

                        )

                    }

                    {

                        place === 1 && (

                            <Sparkles

                                size={16}

                                className="absolute top-4 left-4 text-yellow-300/70"

                            />

                        )

                    }

                    <Crown

                        size={layout.crownSize}

                        className={`mx-auto mb-2 ${theme.text} drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}

                        fill="currentColor"

                        strokeWidth={1.5}

                    />

                    <div className="relative inline-block mt-1">

                        <Avatar

                            name={entry.name}

                            avatar={entry.avatar}

                            size={layout.avatarSize}

                            ringClass={`ring-4 ${theme.ring}`}

                        />

                        <span

                            className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 border-slate-900 shadow-lg ${theme.chip}`}

                        >

                            {place}

                        </span>

                    </div>

                    <h3 className="mt-4 font-bold text-white text-base sm:text-lg tracking-tight truncate">

                        {entry.name}

                    </h3>

                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">

                        {theme.label} Rank

                    </p>

                    <div

                        className={`mt-3 inline-flex items-center gap-1.5 bg-white/10 border border-white/10 backdrop-blur px-3 py-1.5 rounded-full font-bold text-sm ${theme.xpText}`}

                    >

                        <Flame size={15} />

                        <span>

                            {Number(entry.xp ?? 0).toLocaleString()} XP

                        </span>

                    </div>

                    {

                        badges.length > 0 && (

                            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">

                                {

                                    badges.map((badgeKey) => (

                                        <BadgeChip
                                            key={badgeKey}
                                            badgeKey={badgeKey}
                                            size="sm"
                                        />

                                    ))

                                }

                            </div>

                        )

                    }

                    <p className="mt-3 text-xs text-slate-400">

                        {entry.completed_courses ?? 0} courses completed

                    </p>

                    <div className="mt-3 flex items-center justify-center gap-2">

                        <ProgressBar

                            value={entry.progress}

                            trackClass="h-1.5 w-20"

                        />

                        <span className="text-[11px] font-semibold text-slate-300">

                            {Math.round(entry.progress ?? 0)}%

                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

function Leaderboard({

    leaderboard = [],

    currentLearnerId = null,

}) {

    const first = leaderboard.find((entry) => entry.rank === 1) ?? leaderboard[0];

    const second = leaderboard.find((entry) => entry.rank === 2) ?? leaderboard[1];

    const third = leaderboard.find((entry) => entry.rank === 3) ?? leaderboard[2];

    const hasPodium = Boolean(first || second || third);

    const badgeMap = computeBadges(leaderboard);

    return (

        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-10">

            {/* ==========================================
                Scoped animation keyframes
                (kept inline so this remains a single,
                self-contained file with no config changes)
            ========================================== */}

            <style>
                {`
                    @keyframes lb-fade-in-up {
                        from {
                            opacity: 0;
                            transform: translateY(6px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes lb-glow-ring {
                        0%, 100% {
                            box-shadow: 0 0 0 0 rgba(129, 140, 248, 0.45);
                        }
                        50% {
                            box-shadow: 0 0 0 6px rgba(129, 140, 248, 0);
                        }
                    }

                    .lb-badge-pop {
                        animation: lb-fade-in-up 0.35s ease-out both;
                        transition: transform 0.2s ease;
                    }

                    .lb-badge-pop:hover {
                        transform: translateY(-1px) scale(1.05);
                    }

                    .lb-current-glow {
                        animation: lb-glow-ring 2.4s ease-in-out infinite;
                        border-radius: 1.5rem;
                    }

                    .lb-row-highlight {
                        position: relative;
                    }

                    .lb-row-highlight::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        border-left: 3px solid rgb(129 140 248);
                        pointer-events: none;
                    }
                `}
            </style>

            {/* ==========================================
                Header
            ========================================== */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">

                        <Trophy

                            size={26}

                            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"

                        />

                        Leaderboard

                    </h2>

                    <p className="text-slate-400 mt-1 text-xs sm:text-sm uppercase tracking-wider font-medium">

                        Top learners ranked by XP this term

                    </p>

                </div>

            </div>

            {/* ==========================================
                Podium
            ========================================== */}

            {

                hasPodium && (

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-10">

                        <PodiumCard
                            entry={second}
                            place={2}
                            badges={second ? badgeMap.get(second.id) ?? [] : []}
                            isCurrentLearner={Boolean(second) && second.id === currentLearnerId}
                        />

                        <PodiumCard
                            entry={first}
                            place={1}
                            badges={first ? badgeMap.get(first.id) ?? [] : []}
                            isCurrentLearner={Boolean(first) && first.id === currentLearnerId}
                        />

                        <PodiumCard
                            entry={third}
                            place={3}
                            badges={third ? badgeMap.get(third.id) ?? [] : []}
                            isCurrentLearner={Boolean(third) && third.id === currentLearnerId}
                        />

                    </div>

                )

            }

            {/* ==========================================
                Badge legend
            ========================================== */}

            {

                leaderboard.length > 0 && (

                    <div className="flex flex-wrap items-center gap-2 mb-6">

                        {

                            Object.keys(BADGE_DEFS).map((badgeKey) => (

                                <BadgeChip
                                    key={badgeKey}
                                    badgeKey={badgeKey}
                                    size="md"
                                />

                            ))

                        }

                    </div>

                )

            }

            {/* ==========================================
                Table
            ========================================== */}

            {

                leaderboard.length === 0
                    ? (

                        <div className="text-center py-16">

                            <Trophy
                                size={48}
                                className="mx-auto text-slate-600 mb-4"
                            />

                            <p className="text-slate-400">

                                No leaderboard data yet. Start learning to earn XP!

                            </p>

                        </div>

                    )
                    : (

                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">

                            <table className="w-full text-left border-collapse min-w-[680px]">

                                <thead>

                                    <tr className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-widest">

                                        <th className="py-4 px-5 font-semibold">

                                            Rank

                                        </th>

                                        <th className="py-4 px-5 font-semibold">

                                            Learner

                                        </th>

                                        <th className="py-4 px-5 font-semibold text-right">

                                            XP

                                        </th>

                                        <th className="py-4 px-5 font-semibold text-right">

                                            Completed Courses

                                        </th>

                                        <th className="py-4 px-5 font-semibold text-right">

                                            Progress

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        leaderboard.map((entry, index) => {

                                            const theme = RANK_THEME[entry.rank];

                                            const entryBadges = badgeMap.get(entry.id) ?? [];

                                            const isCurrentLearner = entry.id === currentLearnerId;

                                            return (

                                                <tr

                                                    key={entry.id ?? index}

                                                    className={`border-t border-white/5 hover:bg-white/[0.06] hover:shadow-lg transition-all duration-200 ${
                                                        isCurrentLearner
                                                            ? "bg-indigo-500/10 lb-row-highlight"
                                                            : ""
                                                    }`}

                                                >

                                                    <td className="py-4 px-5">

                                                        <span

                                                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-extrabold text-sm border ${
                                                                theme
                                                                    ? `bg-gradient-to-br ${theme.borderGradient} ${theme.text} border-white/20 shadow-md`
                                                                    : "bg-white/5 text-slate-300 border-white/10"
                                                            }`}

                                                        >

                                                            {entry.rank ?? index + 1}

                                                        </span>

                                                    </td>

                                                    <td className="py-4 px-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="relative">

                                                                <Avatar

                                                                    name={entry.name}

                                                                    avatar={entry.avatar}

                                                                    size={40}

                                                                    ringClass={
                                                                        isCurrentLearner
                                                                            ? "ring-2 ring-indigo-400/80"
                                                                            : theme
                                                                                ? `ring-2 ${theme.ring}`
                                                                                : "ring-1 ring-white/10"
                                                                    }

                                                                />

                                                                {

                                                                    theme && (

                                                                        <Crown

                                                                            size={14}

                                                                            className={`absolute -top-1.5 -right-1.5 ${theme.text} drop-shadow`}

                                                                            fill="currentColor"

                                                                        />

                                                                    )

                                                                }

                                                            </div>

                                                            <div>

                                                                <div className="flex items-center gap-2">

                                                                    <span className="font-semibold text-white tracking-tight">

                                                                        {entry.name}

                                                                    </span>

                                                                    {

                                                                        isCurrentLearner && (

                                                                            <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">

                                                                                You

                                                                            </span>

                                                                        )

                                                                    }

                                                                </div>

                                                                {

                                                                    entryBadges.length > 0 && (

                                                                        <div className="flex flex-wrap items-center gap-1 mt-1">

                                                                            {

                                                                                entryBadges.map((badgeKey) => (

                                                                                    <BadgeChip
                                                                                        key={badgeKey}
                                                                                        badgeKey={badgeKey}
                                                                                        size="sm"
                                                                                    />

                                                                                ))

                                                                            }

                                                                        </div>

                                                                    )

                                                                }

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="py-4 px-5 text-right">

                                                        <span className="inline-flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-bold text-xs px-3 py-1.5 rounded-full">

                                                            <Flame size={12} />

                                                            {Number(entry.xp ?? 0).toLocaleString()}

                                                        </span>

                                                    </td>

                                                    <td className="py-4 px-5 text-right text-slate-300 font-medium">

                                                        {entry.completed_courses ?? 0}

                                                    </td>

                                                    <td className="py-4 px-5 text-right">

                                                        <div className="flex items-center justify-end gap-3">

                                                            <span className="text-slate-300 text-sm w-10 text-right font-semibold">

                                                                {Math.round(entry.progress ?? 0)}%

                                                            </span>

                                                            <div className="hidden sm:block">

                                                                <ProgressBar

                                                                    value={entry.progress}

                                                                    trackClass="h-2 w-24"

                                                                />

                                                            </div>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        })

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

            }

        </div>

    );

}

export default Leaderboard;