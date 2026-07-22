import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {

    Clock,

    MonitorPlay,

    BookOpen,

    CheckCircle,

    Circle,

    Tag,

} from "lucide-react";

import { getCourse } from "../../services/courseService";

import { getLessonsByCourse } from "../../services/lessonService";

import { enrollCourse } from "../../services/enrollmentService";

function CourseDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] = useState(null);

    const [lessons, setLessons] = useState([]);

    const [loading, setLoading] = useState(true);

    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {

        fetchCourse();

    }, [id]);

    const fetchCourse = async () => {

        try {

            const courseResponse = await getCourse(id);

            setCourse(courseResponse);

            const lessonResponse = await getLessonsByCourse(id);

            setLessons(lessonResponse);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    const handleEnroll = async () => {

        try {

            setEnrolling(true);

            const response = await enrollCourse(course.id);

            alert(response.message);

        }

        catch (error) {

            if (error.response) {

                alert(error.response.data.detail);

            }

            else {

                alert("Something went wrong.");

            }

        }

        finally {

            setEnrolling(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h2 className="text-2xl font-semibold">

                    Loading Course...

                </h2>

            </div>

        );

    }

    if (!course) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h2 className="text-2xl font-semibold">

                    Course Not Found

                </h2>

            </div>

        );

    }

    const tags = course.category

        ? course.category

            .split(",")

            .map(tag => tag.trim())

        : [];

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">
                    {/* ==========================================
            Hero Thumbnail
        ========================================== */}

        <div className="overflow-hidden rounded-3xl shadow-xl">

            <img

                src={

                    course.thumbnail

                        ? (

                            course.thumbnail.startsWith("/")

                                ? `http://127.0.0.1:8000${course.thumbnail}`

                                : `http://127.0.0.1:8000/uploads/thumbnails/${course.thumbnail}`

                        )

                        : "https://placehold.co/1200x500/e2e8f0/475569?text=Course"

                }

                alt={course.title}

                className="w-full h-[420px] object-cover"

            />

        </div>

        {/* ==========================================
            Course Title
        ========================================== */}

        <h1 className="text-4xl font-bold text-slate-800 mt-10">

            {course.title}

        </h1>

        {/* ==========================================
            Tags
        ========================================== */}

        <div className="flex flex-wrap gap-3 mt-5">

            {

                tags.map((tag, index) => (

                    <span

                        key={index}

                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"

                    >

                        <Tag size={16} />

                        {tag}

                    </span>

                ))

            }

        </div>

        {/* ==========================================
            About this Course
        ========================================== */}

        <section className="mt-10">

            <h2 className="text-3xl font-bold text-slate-800 mb-4">

                About this Course

            </h2>

            <p className="text-lg text-slate-600 leading-8">

                {course.description}

            </p>

        </section>

        {/* ==========================================
            Course Information
        ========================================== */}

        <div className="grid md:grid-cols-3 gap-6 mt-12">

            {/* Duration */}

            <div className="bg-white rounded-2xl shadow-md p-6">

                <div className="flex items-center gap-3">

                    <Clock

                        size={28}

                        className="text-indigo-600"

                    />

                    <h3 className="text-xl font-semibold">

                        Duration

                    </h3>

                </div>

                <p className="mt-4 text-lg text-slate-600">

                    {course.duration} mins

                </p>

            </div>

            {/* Format */}

            <div className="bg-white rounded-2xl shadow-md p-6">

                <div className="flex items-center gap-3">

                    <MonitorPlay

                        size={28}

                        className="text-indigo-600"

                    />

                    <h3 className="text-xl font-semibold">

                        Format

                    </h3>

                </div>

                <p className="mt-4 text-lg text-slate-600">

                    {course.format}

                </p>

            </div>

            {/* Lessons */}

            <div className="bg-white rounded-2xl shadow-md p-6">

                <div className="flex items-center gap-3">

                    <BookOpen

                        size={28}

                        className="text-indigo-600"

                    />

                    <h3 className="text-xl font-semibold">

                        Lessons

                    </h3>

                </div>

                <p className="mt-4 text-lg text-slate-600">

                    {lessons.length}

                </p>

            </div>

        </div>
                {/* ==========================================
            Course Content
        ========================================== */}

        <section className="bg-white rounded-3xl shadow-md mt-12 p-8">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-3xl font-bold text-slate-800">

                    Course Content

                </h2>

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">

                    {lessons.length} Lessons

                </span>

            </div>

            {

                lessons.length === 0

                    ? (

                        <div className="text-center py-12">

                            <BookOpen

                                size={60}

                                className="mx-auto text-slate-300 mb-4"

                            />

                            <h3 className="text-xl font-semibold text-slate-600">

                                No Lessons Available

                            </h3>

                            <p className="text-slate-500 mt-2">

                                Lessons will appear here once they are added.

                            </p>

                        </div>

                    )

                    : (

                        <div className="space-y-4">

                            {

                                lessons.map((lesson, index) => (

                                    <div

                                        key={lesson.id}

                                        className="flex justify-between items-center bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-2xl p-5 transition"

                                    >

                                        <div className="flex items-center gap-5">

                                            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

                                                {index + 1}

                                            </div>

                                            <div>

                                                <h3 className="text-lg font-semibold text-slate-800">

                                                    {lesson.title}

                                                </h3>

                                                {

                                                    lesson.description && (

                                                        <p className="text-slate-500 mt-1">

                                                            {lesson.description}

                                                        </p>

                                                    )

                                                }

                                            </div>

                                        </div>

                                        {

                                            lesson.completed

                                                ? (

                                                    <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">

                                                        <CheckCircle size={18} />

                                                        Completed

                                                    </span>

                                                )

                                                : (

                                                    <span className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">

                                                        <Circle size={18} />

                                                        Not Started

                                                    </span>

                                                )

                                        }

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </section>
                {/* ==========================================
            Action Buttons
        ========================================== */}

        <div className="mt-12 flex flex-col md:flex-row justify-center gap-4">

            <button

                onClick={handleEnroll}

                disabled={enrolling}

                className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:bg-slate-400"

            >

                {

                    enrolling

                        ? "Enrolling..."

                        : "Enroll Now"

                }

            </button>

            <button

                onClick={() => navigate("/courses")}

                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition px-10 py-4 rounded-2xl text-lg font-semibold"

            >

                Back to Courses

            </button>

        </div>

    </div>

);

}

export default CourseDetails;