import { useEffect, useState } from "react";

import {
    Users,
    UserCheck,
    ShieldCheck,
    BookOpen,
    ClipboardList,
    HelpCircle,
    BarChart3,
    Award
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getDashboard } from "../../services/adminService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await getDashboard();

            setDashboard(response);

        }

        catch (err) {

            console.error(err);

            setError("Failed to load dashboard.");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <AdminLayout>

                <div className="flex justify-center items-center h-[80vh] text-2xl">

                    Loading Dashboard...

                </div>

            </AdminLayout>

        );

    }

    if (error) {

        return (

            <AdminLayout>

                <div className="flex justify-center items-center h-[80vh] text-red-600 text-2xl">

                    {error}

                </div>

            </AdminLayout>

        );

    }

    const cards = [

        {
            title: "Total Users",
            value: dashboard.total_users,
            icon: Users,
            color: "bg-blue-500"
        },

        {
            title: "Learners",
            value: dashboard.total_learners,
            icon: UserCheck,
            color: "bg-green-500"
        },

        {
            title: "Admins",
            value: dashboard.total_admins,
            icon: ShieldCheck,
            color: "bg-purple-500"
        },

        {
            title: "Courses",
            value: dashboard.total_courses,
            icon: BookOpen,
            color: "bg-orange-500"
        },

        {
            title: "Assessments",
            value: dashboard.total_assessments,
            icon: ClipboardList,
            color: "bg-pink-500"
        },

        {
            title: "Questions",
            value: dashboard.total_questions,
            icon: HelpCircle,
            color: "bg-cyan-500"
        },

        {
            title: "Quiz Attempts",
            value: dashboard.quiz_attempts,
            icon: BarChart3,
            color: "bg-indigo-500"
        },

        {
            title: "Pass Rate",
            value: `${dashboard.pass_rate}%`,
            icon: Award,
            color: "bg-emerald-500"
        }

    ];

    return (

        <AdminLayout>

            <div>

                <div className="mb-10">

                    <h1 className="text-4xl font-bold">

                        Platform Overview

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Welcome to the LearnSphere Administration Panel.

                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {

                        cards.map((card) => {

                            const Icon = card.icon;

                            return (

                                <div
                                    key={card.title}
                                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                                >

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <p className="text-slate-500">

                                                {card.title}

                                            </p>

                                            <h2 className="text-4xl font-bold mt-3">

                                                {card.value}

                                            </h2>

                                        </div>

                                        <div
                                            className={`${card.color} p-4 rounded-xl text-white`}
                                        >

                                            <Icon size={28} />

                                        </div>

                                    </div>

                                </div>

                            );

                        })

                    }

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                    <div className="bg-white rounded-2xl shadow-md p-8">

                        <h2 className="text-2xl font-bold">

                            Average Quiz Score

                        </h2>

                        <div className="mt-8 text-center">

                            <span className="text-6xl font-bold text-indigo-600">

                                {dashboard.average_score}%

                            </span>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8">

                        <h2 className="text-2xl font-bold">

                            Platform Summary

                        </h2>

                        <div className="mt-8 space-y-4 text-lg">

                            <div className="flex justify-between">

                                <span>Total Users</span>

                                <strong>{dashboard.total_users}</strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Total Courses</span>

                                <strong>{dashboard.total_courses}</strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Assessments</span>

                                <strong>{dashboard.total_assessments}</strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Quiz Attempts</span>

                                <strong>{dashboard.quiz_attempts}</strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Pass Rate</span>

                                <strong>{dashboard.pass_rate}%</strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );

}

export default Dashboard;
