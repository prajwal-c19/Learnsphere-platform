import { useEffect, useState } from "react";

import LearnerLayout from "../../layouts/LearnerLayout";

import StatCard from "../../components/common/StatCard";
import DashboardCourseCard from "../../components/learner/DashboardCourseCard";
import ActivityCard from "../../components/learner/ActivityCard";

import API from "../../api/axios";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await API.get(
                "/dashboard"
            );

            setDashboard(
                response.data
            );

        }

        catch (error) {

            console.error(error);

            setError(
                "Failed to load dashboard. Please try logging in again."
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

                <div className="flex justify-center items-center h-[70vh] text-center">

                    <h1 className="text-2xl font-semibold text-red-500">

                        {error || "Unable to load dashboard."}

                    </h1>

                </div>

            </LearnerLayout>

        );

    }

    return (

        <LearnerLayout>

            <div className="grid grid-cols-3 gap-6">

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

            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="col-span-2 space-y-6">

                    {

                        dashboard.enrollments.length === 0

                            ?

                            (

                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                                    <h2 className="text-2xl font-bold">

                                        No Enrollments Yet

                                    </h2>

                                    <p className="text-slate-500 mt-3">

                                        Enroll in a course to start learning.

                                    </p>

                                </div>

                            )

                            :

                            (

                                dashboard.enrollments.map(

                                    (
                                        enrollment
                                    ) => (

                                        <DashboardCourseCard

                                            key={
                                                enrollment.id
                                            }

                                            enrollment={
                                                enrollment
                                            }

                                        />

                                    )

                                )

                            )

                    }

                </div>
                                <ActivityCard

                    recentResults={
                        dashboard.recent_results
                    }

                />

            </div>

        </LearnerLayout>

    );

}

export default Dashboard;
