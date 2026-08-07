import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";

import StatCard from "../../components/common/StatCard";
import DashboardCourseCard from "../../components/learner/DashboardCourseCard";
import ActivityCard from "../../components/learner/ActivityCard";
import Leaderboard from "../../components/learner/Leaderboard";

import API from "../../api/axios";
import { getLeaderboard } from "../../services/dashboardService";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [leaderboard, setLeaderboard] = useState([]);

    const [leaderboardLoading, setLeaderboardLoading] = useState(true);

    // ==========================================
    // Hero Banner States
    // ==========================================

    const [userRank, setUserRank] = useState(null);

    const [userXP, setUserXP] = useState(0);

    const [xpNeeded, setXpNeeded] = useState(0);

    const [hero, setHero] = useState({

        title: "👋 Welcome Back!",

        subtitle:
            "Continue your learning journey, complete your courses, and unlock new achievements.",

        badge: "🚀 Keep Growing",

        gradient:
            "from-indigo-600 via-blue-600 to-cyan-500",

        badgeColor:
            "bg-indigo-100 text-indigo-700"

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    useEffect(() => {

        if (dashboard) {
            if (dashboard?.user_id) {

                loadLeaderboard();
            }

        }

    }, [dashboard]);

    const loadDashboard = async () => {

        try {

            const response = await API.get("/dashboard");

            setDashboard(response.data);

        }

        catch (error) {

            console.error(error);

            setError(
                "Failed to load dashboard. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const loadLeaderboard = async () => {

        try {

            const data = await getLeaderboard();

            const board = data?.leaderboard ?? [];

            setLeaderboard(board);

            const currentUser = board.find(

                (user) => user.id === dashboard.user_id

            );

            if (!currentUser) return;

            setUserRank(currentUser.rank);

            setUserXP(currentUser.xp);

            if (currentUser.rank > 1) {

                const above = board.find(

                    (user) => user.rank === currentUser.rank - 1

                );

                if (above) {

                    const diff = Math.max(

                        above.xp - currentUser.xp,

                        0

                    );

                    setXpNeeded(diff);

                }

            }

            if (currentUser.rank === 1) {

                setHero({

                    title:
                        "👑 Welcome Back, Champion!",

                    subtitle:
                        "Congratulations! You're currently the Top Learner on LearnSphere. Keep learning to defend your crown.",

                    badge:
                        "🏅 Top Learner",

                    gradient:
                        "from-yellow-400 via-yellow-500 to-amber-600",

                    badgeColor:
                        "bg-yellow-100 text-yellow-800"

                });

            }

            else if (currentUser.rank === 2) {

                setHero({

                    title:
                        "🥈 Almost There!",

                    subtitle:
                        `Only ${Math.max(
                            board[0].xp - currentUser.xp,
                            0
                        )} XP left to become the Top Learner.`,

                    badge:
                        "🥈 Silver Challenger",

                    gradient:
                        "from-slate-400 via-slate-500 to-slate-600",

                    badgeColor:
                        "bg-slate-100 text-slate-700"

                });

            }
                        else if (currentUser.rank === 3) {

                setHero({

                    title:
                        "🥉 Great Progress!",

                    subtitle:
                        "You're among the Top 3 learners. Keep pushing towards the top.",

                    badge:
                        "🥉 Bronze Performer",

                    gradient:
                        "from-orange-400 via-orange-500 to-amber-700",

                    badgeColor:
                        "bg-orange-100 text-orange-700"

                });

            }

        }

        catch (error) {

            console.error(error);

            setLeaderboard([]);

        }

        finally {

            setLeaderboardLoading(false);

        }

    };

    if (loading) {

        return (

            <LearnerLayout>

                <div className="flex justify-center items-center h-[70vh]">

                    <h1 className="text-3xl font-bold">

                        Loading Dashboard...

                    </h1>

                </div>

            </LearnerLayout>

        );

    }

    if (error || !dashboard) {

        return (

            <LearnerLayout>

                <div className="flex justify-center items-center h-[70vh]">

                    <div className="text-center">

                        <h1 className="text-3xl font-bold text-red-500">

                            Oops!

                        </h1>

                        <p className="mt-3 text-slate-500">

                            {error}

                        </p>

                    </div>

                </div>

            </LearnerLayout>

        );

    }

    return (

        <LearnerLayout>

            {/* ==========================================
                Dynamic Welcome Banner
            ========================================== */}

            <div
                className={`bg-gradient-to-r ${hero.gradient} rounded-3xl text-white p-10 shadow-2xl`}
            >

                <div className="flex flex-col lg:flex-row justify-between items-center">

                    <div>

                        <h1 className="text-4xl font-bold">

                            {hero.title}

                        </h1>

                        <p className="mt-3 text-lg text-white/90 max-w-2xl">

                            {hero.subtitle}

                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">

                            <span
                                className={`${hero.badgeColor} px-5 py-2 rounded-full font-semibold`}
                            >

                                {hero.badge}

                            </span>

                            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full">

                                📚 {dashboard.enrolled_courses} Enrolled

                            </span>

                            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full">

                                🏆 {dashboard.completed_courses} Completed

                            </span>

                            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full">

                                📈 {dashboard.overall_progress}% Progress

                            </span>

                        </div>

                    </div>

                    <div className="mt-8 lg:mt-0">

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-72 border border-white/20">

                            <h3 className="text-xl font-semibold mb-5">

                                Leaderboard Status

                            </h3>

                            <div className="space-y-4">

                                <div className="flex justify-between">

                                    <span>Your Rank</span>

                                    <span className="font-bold text-2xl">

                                        #{userRank ?? "--"}

                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span>Your XP</span>

                                    <span className="font-bold">

                                        {userXP}

                                    </span>

                                </div>
                                                                {

                                    userRank !== 1 && (

                                        <div className="flex justify-between">

                                            <span>XP to Next Rank</span>

                                            <span className="font-bold">

                                                {xpNeeded}

                                            </span>

                                        </div>

                                    )

                                }

                                {

                                    userRank === 1 && (

                                        <div className="bg-yellow-300 text-black rounded-xl py-2 text-center font-bold animate-pulse">

                                            👑 DEFEND YOUR CROWN

                                        </div>

                                    )

                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                Dashboard Statistics
            ========================================== */}

            <div className="grid md:grid-cols-3 gap-6 mt-10">

                <StatCard

                    title="Enrolled Courses"

                    value={dashboard.enrolled_courses}

                    icon="📚"

                />

                <StatCard

                    title="Completed"

                    value={dashboard.completed_courses}

                    icon="🏆"

                />

                <StatCard

                    title="Overall Progress"

                    value={`${dashboard.overall_progress}%`}

                    icon="📈"

                />

            </div>

            {/* ==========================================
                Leaderboard
            ========================================== */}

            <div className="mt-10">

                {

                    leaderboardLoading

                        ? (

                            <div className="bg-slate-900 rounded-3xl border border-white/10 shadow-2xl py-16 text-center">

                                <p className="text-slate-400 font-semibold">

                                    Loading leaderboard...

                                </p>

                            </div>

                        )

                        : (

                            <Leaderboard

                                leaderboard={leaderboard}

                            />

                        )

                }

            </div>

            {/* ==========================================
                Continue Learning Header
            ========================================== */}

            <div className="flex justify-between items-center mt-12 mb-6">

                <div>

                    <h2 className="text-3xl font-bold text-slate-800">

                        Continue Learning

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Pick up where you left off.

                    </p>

                </div>

                {

                    dashboard.enrollments.length > 3 && (

                        <button

                            onClick={() => navigate("/my-courses")}

                            className="text-indigo-600 font-semibold hover:underline"

                        >

                            View All →

                        </button>

                    )

                }

            </div>

            {/* ==========================================
                Dashboard Content
            ========================================== */}

            <div className="grid lg:grid-cols-3 gap-8">
                                {/* ==========================================
                    Continue Learning Cards
                ========================================== */}

                <div className="lg:col-span-2 space-y-6">

                    {

                        dashboard.enrollments.length === 0

                            ? (

                                <div className="bg-white rounded-3xl shadow-md border border-slate-200 py-20 px-8 text-center">

                                    <div className="text-6xl mb-6">

                                        📚

                                    </div>

                                    <h2 className="text-3xl font-bold">

                                        No Courses Yet

                                    </h2>

                                    <p className="text-slate-500 mt-3">

                                        Start your learning journey by enrolling in your first course.

                                    </p>

                                    <button

                                        onClick={() => navigate("/courses")}

                                        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl transition"

                                    >

                                        Browse Courses

                                    </button>

                                </div>

                            )

                            : (

                                dashboard.enrollments

                                    .slice(0, 3)

                                    .map((enrollment) => (

                                        <DashboardCourseCard

                                            key={enrollment.id}

                                            enrollment={enrollment}

                                        />

                                    ))

                            )

                    }

                </div>

                {/* ==========================================
                    Right Sidebar
                ========================================== */}

                <div className="space-y-6">

                    <ActivityCard

                        recentResults={dashboard.recent_results}

                    />

                    <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6">

                        <h2 className="text-2xl font-bold mb-5">

                            Learning Goal 🎯

                        </h2>

                        <div className="space-y-4">

                            <div>

                                <div className="flex justify-between text-sm mb-2">

                                    <span>This Week</span>

                                    <span>

                                        {dashboard.overall_progress}%

                                    </span>

                                </div>

                                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                                    <div

                                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"

                                        style={{

                                            width: `${dashboard.overall_progress}%`

                                        }}

                                    />

                                </div>

                            </div>

                            <p className="text-slate-500 text-sm leading-6">

                                {

                                    userRank === 1

                                        ? "👑 Amazing! You're the Top Learner. Keep completing lessons and defend your crown."

                                        : userRank === 2

                                        ? `🥈 Only ${xpNeeded} XP left to become the Top Learner.`

                                        : userRank === 3

                                        ? "🥉 You're already among the Top 3 learners. Keep pushing!"

                                        : "Keep learning consistently. Every completed lesson brings you closer to the leaderboard."

                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                Quick Actions
            ========================================== */}

            <div className="mt-14">

                <h2 className="text-3xl font-bold text-slate-800 mb-6">

                    Quick Actions

                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <button

                        onClick={() => navigate("/courses")}

                        className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

                    >

                        <div className="text-5xl">

                            📚

                        </div>

                        <h3 className="text-2xl font-bold mt-5">

                            Browse Courses

                        </h3>

                        <p className="text-slate-500 mt-2">

                            Discover new courses and continue expanding your skills.

                        </p>

                    </button>

                    <button

                        onClick={() => navigate("/my-courses")}

                        className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

                    >

                        <div className="text-5xl">

                            🎓

                        </div>

                        <h3 className="text-2xl font-bold mt-5">

                            My Learning

                        </h3>

                        <p className="text-slate-500 mt-2">

                            Continue your enrolled courses and track your learning progress.

                        </p>

                    </button>

                    <button

                        onClick={() => navigate("/results")}

                        className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

                    >

                        <div className="text-5xl">

                            🏆

                        </div>

                        <h3 className="text-2xl font-bold mt-5">

                            Results

                        </h3>

                        <p className="text-slate-500 mt-2">

                            View assessment scores and monitor your achievements.

                        </p>

                    </button>

                </div>

            </div>

        </LearnerLayout>

    );

}

export default Dashboard;