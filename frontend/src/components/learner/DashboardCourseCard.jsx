import { useNavigate } from "react-router-dom";

import {

    Clock,

    MonitorPlay,

    Tag,

    PlayCircle,

    CheckCircle,

} from "lucide-react";

function DashboardCourseCard({

    enrollment

}) {

    const navigate = useNavigate();

    const handleContinue = () => {

        navigate(

            `/course/${enrollment.course.id}/lessons`

        );

    };

    const tags = enrollment.course.category

        ? enrollment.course.category

            .split(",")

            .map(tag => tag.trim())

        : [];

    return (

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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

                    <span

                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            enrollment.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}

                    >

                        {

                            enrollment.status === "Completed"

                                ? "Completed"

                                : "In Progress"

                        }

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

                            Learning Progress

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
                    Course Information
                ========================================== */}

                <div className="grid grid-cols-2 gap-6 mt-7">

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
                    Progress Status
                ========================================== */}

                <div className="mt-7 bg-slate-50 rounded-xl p-4 flex items-center gap-3">

                    {

                        enrollment.progress === 100 ? (

                            <CheckCircle

                                size={24}

                                className="text-green-600"

                            />

                        ) : (

                            <PlayCircle

                                size={24}

                                className="text-indigo-600"

                            />

                        )

                    }

                    <div>

                        <p className="font-semibold">

                            {

                                enrollment.progress === 100

                                    ? "Course Completed"

                                    : "Keep Learning"

                            }

                        </p>

                        <p className="text-sm text-slate-500">

                            {

                                enrollment.progress === 100

                                    ? "Great job! You've completed this course."

                                    : `You have completed ${enrollment.progress}% of this course.`

                            }

                        </p>

                    </div>

                </div>
                                {/* ==========================================
                    Continue Learning Button
                ========================================== */}

                <button

                    onClick={handleContinue}

                    className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-300"

                >

                    <PlayCircle size={20} />

                    {

                        enrollment.progress === 0

                            ? "Start Learning"

                            : enrollment.progress === 100

                                ? "Review Course"

                                : "Continue Learning"

                    }

                </button>

            </div>

        </div>

    );

}

export default DashboardCourseCard;