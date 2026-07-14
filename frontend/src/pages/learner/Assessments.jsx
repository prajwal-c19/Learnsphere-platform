import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";

import {
    getMyAssessments,
} from "../../services/assessmentService";

function Assessments() {

    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchAssessments();

    }, []);

    const fetchAssessments = async () => {

        try {

            const data =
                await getMyAssessments();

            setAssessments(data);

        }

        catch (error) {

            console.error(error);

            setError(
                "Unable to load assessments."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const totalAssessments =
        assessments.length;

    const available =
        assessments.filter(
            (assessment) => assessment.available
        ).length;

    const locked =
        totalAssessments - available;

    const completed =
        assessments.filter(
            (assessment) =>
                assessment.status === "Completed"
        ).length;

    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center mt-20 text-2xl">

                    Loading Assessments...

                </div>

            </LearnerLayout>

        );

    }

    if (error) {

        return (

            <LearnerLayout>

                <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                    <h2 className="text-2xl font-bold text-red-500">

                        {error}

                    </h2>

                </div>

            </LearnerLayout>

        );

    }

    return (

        <LearnerLayout>

            <div className="max-w-7xl mx-auto">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-slate-800">

                        Assessment Center

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Track your assessments and continue your learning journey.

                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Assessments

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {totalAssessments}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Available

                        </p>

                        <h2 className="text-4xl font-bold text-green-600 mt-2">

                            {available}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Locked

                        </p>

                        <h2 className="text-4xl font-bold text-red-600 mt-2">

                            {locked}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Completed

                        </p>

                        <h2 className="text-4xl font-bold text-indigo-600 mt-2">

                            {completed}

                        </h2>

                    </div>

                </div>

                <div className="mt-10 space-y-6">
                                    {

                    assessments.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">

                            <h2 className="text-2xl font-bold text-slate-700">

                                No Assessments Available

                            </h2>

                            <p className="text-slate-500 mt-3">

                                Enroll in a course to access assessments.

                            </p>

                        </div>

                    ) : (

                        assessments.map((assessment) => (

                            <div
                                key={assessment.assessment_id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
                            >

                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">

                                    <div className="flex-1">

                                        <h2 className="text-2xl font-bold text-slate-800">

                                            {assessment.course_name}

                                        </h2>

                                        <p className="text-slate-500 mt-2">

                                            {assessment.assessment_title}

                                        </p>

                                        <div className="mt-6">

                                            <div className="flex justify-between text-sm mb-2">

                                                <span className="font-medium">

                                                    Progress

                                                </span>

                                                <span>

                                                    {assessment.progress}%

                                                </span>

                                            </div>

                                            <div className="w-full bg-slate-200 rounded-full h-3">

                                                <div
                                                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${assessment.progress}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-6 min-w-[260px]">

                                        <div>

                                            <p className="text-slate-500 text-sm">

                                                Attempts

                                            </p>

                                            <h3 className="text-2xl font-bold">

                                                {assessment.attempts}

                                            </h3>

                                        </div>

                                        <div>

                                            <p className="text-slate-500 text-sm">

                                                Best Score

                                            </p>

                                            <h3 className="text-2xl font-bold text-indigo-600">

                                                {assessment.best_score}%

                                            </h3>

                                        </div>

                                        <div>

                                            <p className="text-slate-500 text-sm">

                                                Status

                                            </p>

                                            <span
                                                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-1 ${
                                                    assessment.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >

                                                {assessment.status}

                                            </span>

                                        </div>

                                        <div>

                                            <p className="text-slate-500 text-sm">

                                                Assessment

                                            </p>

                                            {

                                                assessment.available ? (

                                                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mt-1 bg-green-100 text-green-700">

                                                        ✅ Available

                                                    </span>

                                                ) : (

                                                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mt-1 bg-red-100 text-red-700">

                                                        🔒 Locked

                                                    </span>

                                                )

                                            }

                                        </div>

                                    </div>

                                    <div className="flex flex-col gap-4">

                                        {

                                            !assessment.available ? (

                                                <button
                                                    disabled
                                                    className="bg-slate-300 text-slate-600 px-6 py-3 rounded-xl cursor-not-allowed"
                                                >

                                                    Locked

                                                </button>

                                            ) : assessment.attempts > 0 ? (

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/result/${assessment.assessment_id}`
                                                        )
                                                    }
                                                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                                                >

                                                    View Result

                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/assessment/${assessment.course_id}`
                                                        )
                                                    }
                                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                                                >

                                                    Start Assessment

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </div>

        </LearnerLayout>

    );

}

export default Assessments;