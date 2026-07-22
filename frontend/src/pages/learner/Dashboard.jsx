import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";

import StatCard from "../../components/common/StatCard";
import DashboardCourseCard from "../../components/learner/DashboardCourseCard";
import ActivityCard from "../../components/learner/ActivityCard";

import API from "../../api/axios";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadDashboard();

    }, []);

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
                Welcome Banner
            ========================================== */}

            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl text-white p-10 shadow-2xl">

                <h1 className="text-4xl font-bold">

                    👋 Welcome Back!

                </h1>

                <p className="mt-3 text-lg text-indigo-100">

                    Continue your learning journey, complete your courses, and unlock new achievements.

                </p>

                <div className="flex flex-wrap gap-3 mt-8">

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

                                Keep learning consistently. Completing lessons every day helps you finish courses faster.

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

                    {/* Browse Courses */}

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

                    {/* My Learning */}

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

                            Continue your enrolled courses and track your progress.

                        </p>

                    </button>

                    {/* Results */}

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