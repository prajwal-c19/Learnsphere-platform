import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";

import { getMyEnrollments } from "../../services/enrollmentService";

function MyCourses() {

    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchEnrollments();

    }, []);

    const fetchEnrollments = async () => {

        try {

            const response = await getMyEnrollments();

            setEnrollments(response.data);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load your courses.");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center text-xl mt-20">

                    Loading your courses...

                </div>

            </LearnerLayout>

        );

    }

    return (

        <LearnerLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    My Courses

                </h1>

                <p className="text-slate-500 mt-2">

                    Continue learning from your enrolled courses.

                </p>

            </div>

            {

                enrollments.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                        <h2 className="text-2xl font-semibold">

                            No Courses Yet 📚

                        </h2>

                        <p className="text-slate-500 mt-3">

                            Enroll in a course to start learning.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-2 gap-6">

                        {

                            enrollments.map((enrollment) => (

                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-2xl shadow-md border border-slate-200 p-6"
                                >

                                    <div className="flex justify-between items-center">

                                        <h2 className="text-2xl font-bold">

                                            {enrollment.course.title}

                                        </h2>

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                            {enrollment.status}

                                        </span>

                                    </div>

                                    <p className="text-slate-500 mt-3">

                                        {enrollment.course.description}

                                    </p>

                                    <div className="mt-5">

                                        <div className="flex justify-between text-sm mb-2">

                                            <span>

                                                Progress

                                            </span>

                                            <span>

                                                {enrollment.progress}%

                                            </span>

                                        </div>

                                        <div className="w-full h-3 bg-slate-200 rounded-full">

                                            <div
                                                className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${enrollment.progress}%`
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                    <div className="mt-6 flex justify-between text-sm text-slate-600">

                                        <div>

                                            <strong>Category:</strong>{" "}

                                            {enrollment.course.category}

                                        </div>

                                        <div>

                                            <strong>Format:</strong>{" "}

                                            {enrollment.course.format}

                                        </div>

                                    </div>

                                    {

                                        enrollment.status === "Completed" ? (

                                            <div className="mt-6 w-full bg-slate-100 text-slate-700 px-5 py-3 rounded-xl text-center font-semibold">

                                                ✔ Course Completed

                                            </div>

                                        ) : enrollment.progress < 80 ? (

                                            <>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/course/${enrollment.course.id}/lessons`
                                                        )
                                                    }
                                                    className="mt-6 w-full bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition"
                                                >

                                                    Continue Learning

                                                </button>

                                                <p className="text-sm text-amber-600 mt-3 text-center">

                                                    🔒 Assessment unlocks at 80% progress.

                                                </p>

                                            </>

                                        ) : (

                                            <div className="flex gap-3 mt-6">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/course/${enrollment.course.id}/lessons`
                                                        )
                                                    }
                                                    className="flex-1 bg-slate-200 text-slate-800 px-5 py-3 rounded-xl hover:bg-slate-300 transition"
                                                >

                                                    Review Lessons

                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/assessment/${enrollment.course.id}`
                                                        )
                                                    }
                                                    className="flex-1 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
                                                >

                                                    📝 Start Assessment

                                                </button>

                                            </div>

                                        )

                                    }

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </LearnerLayout>

    );

}

export default MyCourses;
