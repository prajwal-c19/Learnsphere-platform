import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

    Clock,

    MonitorPlay,

    BookOpen,

    Tag,

    CheckCircle,

    PlayCircle,

} from "lucide-react";

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

                <div className="flex justify-center items-center h-[70vh]">

                    <h2 className="text-2xl font-semibold">

                        Loading your courses...

                    </h2>

                </div>

            </LearnerLayout>
        );
    }
            return (

    <LearnerLayout>

        {/* ==========================================
            Page Header
        ========================================== */}

        <div className="mb-10">

            <h1 className="text-4xl font-bold text-slate-800">

                My Learning

            </h1>

            <p className="text-slate-500 mt-2 text-lg">

                Continue where you left off and complete your courses.

            </p>

        </div>

        {

            enrollments.length === 0

                ? (

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 py-20 px-10 text-center">

                        <BookOpen

                            size={70}

                            className="mx-auto text-indigo-500"

                        />

                        <h2 className="text-3xl font-bold mt-6">

                            No Courses Enrolled

                        </h2>

                        <p className="text-slate-500 mt-3">

                            Browse our catalog and enroll in your first course.

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

                    <div className="grid lg:grid-cols-2 gap-8">

                        {

                            enrollments.map((enrollment) => {

                                const tags = enrollment.course.category

                                    ? enrollment.course.category

                                        .split(",")

                                        .map(tag => tag.trim())

                                    : [];

                                return (

                                    <div

                                        key={enrollment.id}

                                        className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"

                                    >
                                                                                {/* ==========================================
                                            Thumbnail
                                        ========================================== */}

                                        <img

                                            src={

                                                enrollment.course.thumbnail

                                                    ? (

                                                        enrollment.course.thumbnail.startsWith("/")

                                                            ? `http://127.0.0.1:8000${enrollment.course.thumbnail}`

                                                            : `http://127.0.0.1:8000/uploads/thumbnails/${enrollment.course.thumbnail}`

                                                    )

                                                    : "https://placehold.co/800x400/e2e8f0/475569?text=Course"

                                            }

                                            alt={enrollment.course.title}

                                            className="w-full h-52 object-cover"

                                        />

                                        <div className="p-6">

                                            {/* ==========================================
                                                Title + Status
                                            ========================================== */}

                                            <div className="flex justify-between items-start">

                                                <h2 className="text-2xl font-bold text-slate-800">

                                                    {enrollment.course.title}

                                                </h2>

                                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                                                    {enrollment.status}

                                                </span>

                                            </div>

                                            {/* ==========================================
                                                Description
                                            ========================================== */}

                                            <p

                                                className="text-slate-500 mt-4 leading-7"

                                                style={{

                                                    display: "-webkit-box",

                                                    WebkitLineClamp: 2,

                                                    WebkitBoxOrient: "vertical",

                                                    overflow: "hidden",

                                                }}

                                            >

                                                {enrollment.course.description}

                                            </p>

                                            {/* ==========================================
                                                Tags
                                            ========================================== */}

                                            <div className="flex flex-wrap gap-2 mt-5">

                                                {

                                                    tags.map((tag, index) => (

                                                        <span

                                                            key={index}

                                                            className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"

                                                        >

                                                            <Tag size={12} />

                                                            {tag}

                                                        </span>

                                                    ))

                                                }

                                            </div>
                                                                                        {/* ==========================================
                                                Progress
                                            ========================================== */}

                                            <div className="mt-7">

                                                <div className="flex justify-between items-center mb-2">

                                                    <span className="font-semibold text-slate-700">

                                                        Course Progress

                                                    </span>

                                                    <span className="font-bold text-indigo-600">

                                                        {enrollment.progress}%

                                                    </span>

                                                </div>

                                                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                                                    <div

                                                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700"

                                                        style={{

                                                            width: `${enrollment.progress}%`

                                                        }}

                                                    />

                                                </div>

                                            </div>

                                            {/* ==========================================
                                                Course Statistics
                                            ========================================== */}

                                            <div className="grid grid-cols-2 gap-5 mt-7">

                                                <div className="flex items-center gap-3">

                                                    <Clock

                                                        size={18}

                                                        className="text-indigo-600"

                                                    />

                                                    <div>

                                                        <p className="text-xs text-slate-500">

                                                            Duration

                                                        </p>

                                                        <p className="font-semibold">

                                                            {enrollment.course.duration} mins

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex items-center gap-3">

                                                    <MonitorPlay

                                                        size={18}

                                                        className="text-indigo-600"

                                                    />

                                                    <div>

                                                        <p className="text-xs text-slate-500">

                                                            Format

                                                        </p>

                                                        <p className="font-semibold">

                                                            {enrollment.course.format}

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ==========================================
                                                Learning Status
                                            ========================================== */}

                                            <div className="mt-7 flex items-center gap-3 bg-slate-50 rounded-xl p-4">

                                                <CheckCircle

                                                    size={22}

                                                    className="text-green-600"

                                                />

                                                <div>

                                                    <p className="font-semibold">

                                                        Learning Progress

                                                    </p>

                                                    <p className="text-sm text-slate-500">

                                                        {enrollment.progress === 100

                                                            ? "Course Completed"

                                                            : enrollment.progress === 0

                                                            ? "Ready to start learning"

                                                            : "Keep going, you're making great progress!"}

                                                    </p>

                                                </div>

                                            </div>
                                                                                        {/* ==========================================
                                                Action Buttons
                                            ========================================== */}

                                            <div className="mt-8">

                                                {

                                                    enrollment.status === "Completed"

                                                        ? (

                                                            <button

                                                                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-default"

                                                            >

                                                                <CheckCircle size={20} />

                                                                Course Completed

                                                            </button>

                                                        )

                                                        : enrollment.progress === 0

                                                            ? (

                                                                <button

                                                                    onClick={() =>

                                                                        navigate(

                                                                            `/course/${enrollment.course.id}/lessons`

                                                                        )

                                                                    }

                                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"

                                                                >

                                                                    <PlayCircle size={20} />

                                                                    Start Learning

                                                                </button>

                                                            )

                                                            : enrollment.progress < 80

                                                                ? (

                                                                    <>

                                                                        <button

                                                                            onClick={() =>

                                                                                navigate(

                                                                                    `/course/${enrollment.course.id}/lessons`

                                                                                )

                                                                            }

                                                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"

                                                                        >

                                                                            <PlayCircle size={20} />

                                                                            Continue Learning

                                                                        </button>

                                                                        <p className="text-center text-amber-600 text-sm mt-3">

                                                                            🔒 Complete 80% of the course to unlock the assessment.

                                                                        </p>

                                                                    </>

                                                                )

                                                                : (

                                                                    <div className="grid grid-cols-2 gap-4">

                                                                        <button

                                                                            onClick={() =>

                                                                                navigate(

                                                                                    `/course/${enrollment.course.id}/lessons`

                                                                                )

                                                                            }

                                                                            className="bg-slate-200 hover:bg-slate-300 py-3 rounded-xl font-semibold transition"

                                                                        >

                                                                            Review Lessons

                                                                        </button>

                                                                        <button

                                                                            onClick={() =>

                                                                                navigate(

                                                                                    `/assessment/${enrollment.course.id}`

                                                                                )

                                                                            }

                                                                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"

                                                                        >

                                                                            📝 Assessment

                                                                        </button>

                                                                    </div>

                                                                )

                                                }

                                            </div>

                                        </div>

                                    </div>

                                );

                            })

                        }

                    </div>

                )

            }

        </LearnerLayout>

    );

}

export default MyCourses;

        
