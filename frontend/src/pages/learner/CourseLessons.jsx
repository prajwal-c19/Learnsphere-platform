import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    CheckCircle2,
    Circle,
    FileText,
    Lock
} from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";

import {
    getLessonsByCourse,
    completeLesson
} from "../../services/lessonService";


/* ==========================================
   Convert YouTube URL to Embed URL
========================================== */

function getYoutubeEmbedUrl(url) {

    if (!url) return null;

    const match = url.match(
        /(?:youtu\.be\/|youtube\.com.*(?:\?v=|\/embed\/|\/v\/))([^\s&?/]+)/
    );

    const videoId = match ? match[1] : null;

    return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : url;

}


function CourseLessons() {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);

    const [activeLesson, setActiveLesson] = useState(null);

    const [loading, setLoading] = useState(true);

    const [marking, setMarking] = useState(false);


    useEffect(() => {

        loadLessons();

    }, []);


    const loadLessons = async () => {

        try {

            const data =
                await getLessonsByCourse(courseId);

            setLessons(data);

            const firstIncomplete =

                data.find(

                    lesson => !lesson.completed

                ) || data[0];

            setActiveLesson(

                firstIncomplete || null

            );

        }

        catch (error) {

            console.error(error);

            alert(

                "Failed to load lessons."

            );

        }

        finally {

            setLoading(false);

        }

    };


    const handleMarkComplete = async (lessonId) => {

        try {

            setMarking(true);

            await completeLesson(
                lessonId
            );

            await loadLessons();

        }

        catch (error) {

            console.error(error);

            alert(

                "Failed to update lesson progress."

            );

        }

        finally {

            setMarking(false);

        }

    };


    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center mt-20 text-xl">

                    Loading Lessons...

                </div>

            </LearnerLayout>

        );

    }


    if (lessons.length === 0) {

        return (

            <LearnerLayout>

                <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                    <h2 className="text-2xl font-bold">

                        No lessons available for this course yet.

                    </h2>

                    <button

                        onClick={() =>

                            navigate(
                                `/assessment/${courseId}`
                            )

                        }

                        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"

                    >

                        Go to Assessment

                    </button>

                </div>

            </LearnerLayout>

        );

    }


    const completedCount =

        lessons.filter(

            lesson => lesson.completed

        ).length;


    const progress = Math.round(

        (completedCount / lessons.length) * 100

    );


    const assessmentUnlocked =

        progress >= 80;


    return (

        <LearnerLayout>

            <div className="grid grid-cols-3 gap-6">
                                {/* ===================================== */}
                {/* Sidebar */}
                {/* ===================================== */}

                <div className="col-span-1 bg-white rounded-2xl shadow-md p-5 h-fit">

                    <h2 className="text-xl font-bold mb-2">

                        Lessons

                    </h2>

                    <p className="text-sm text-slate-500 mb-4">

                        {completedCount} of {lessons.length} completed ({progress}%)

                    </p>

                    <div className="w-full bg-slate-200 rounded-full h-2 mb-5">

                        <div

                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"

                            style={{

                                width: `${progress}%`

                            }}

                        />

                    </div>

                    <div className="space-y-2">

                        {

                            lessons.map((lesson) => (

                                <button

                                    key={lesson.id}

                                    onClick={() =>

                                        setActiveLesson(lesson)

                                    }

                                    className={`

                                        w-full

                                        flex

                                        items-center

                                        gap-3

                                        text-left

                                        px-4

                                        py-3

                                        rounded-xl

                                        transition

                                        ${

                                            activeLesson?.id === lesson.id

                                                ? "bg-indigo-600 text-white"

                                                : "hover:bg-slate-100"

                                        }

                                    `}

                                >

                                    {

                                        lesson.completed

                                        ?

                                        (

                                            <CheckCircle2

                                                size={18}

                                                className={

                                                    activeLesson?.id === lesson.id

                                                        ? "text-white"

                                                        : "text-green-600"

                                                }

                                            />

                                        )

                                        :

                                        (

                                            <Circle

                                                size={18}

                                            />

                                        )

                                    }

                                    <div className="flex flex-col">

                                        <span className="font-medium">

                                            {lesson.order}. {lesson.title}

                                        </span>

                                        {

                                            lesson.video_type === "upload"

                                            ?

                                            (

                                                <span className="text-xs opacity-70">

                                                    📹 Uploaded Video

                                                </span>

                                            )

                                            :

                                            (

                                                <span className="text-xs opacity-70">

                                                    ▶️ YouTube

                                                </span>

                                            )

                                        }

                                    </div>

                                </button>

                            ))

                        }

                    </div>

                    <div className="mt-6 pt-5 border-t">

                        {

                            assessmentUnlocked

                            ?

                            (

                                <button

                                    onClick={() =>

                                        navigate(

                                            `/assessment/${courseId}`

                                        )

                                    }

                                    className="w-full bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"

                                >

                                    📝 Take Assessment

                                </button>

                            )

                            :

                            (

                                <div className="flex items-center justify-center gap-2 text-sm text-amber-600">

                                    <Lock size={16} />

                                    Assessment unlocks at 80% progress

                                </div>

                            )

                        }

                    </div>

                </div>

                {/* ===================================== */}
                {/* Active Lesson */}
                {/* ===================================== */}

                <div className="col-span-2 bg-white rounded-2xl shadow-md p-8">
                                        {

                        activeLesson ? (

                            <>

                                <h1 className="text-3xl font-bold">

                                    {activeLesson.title}

                                </h1>

                                <p className="text-slate-500 mt-2">

                                    {activeLesson.description}

                                </p>

                                {

                                    activeLesson.video_url && (

                                        <div className="mt-6 aspect-video rounded-xl overflow-hidden bg-black">

                                            {

                                                activeLesson.video_type === "youtube"

                                                ? (

                                                    <iframe

                                                        className="w-full h-full"

                                                        src={getYoutubeEmbedUrl(
                                                            activeLesson.video_url
                                                        )}

                                                        title={activeLesson.title}

                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                                                        allowFullScreen

                                                    />

                                                )

                                                : (

                                                    <video

                                                        className="w-full h-full"

                                                        controls

                                                        preload="metadata"

                                                    >

                                                        <source

                                                            src={`http://127.0.0.1:8000${activeLesson.video_url}`}

                                                            type="video/mp4"

                                                        />

                                                        Your browser does not support HTML5 video.

                                                    </video>

                                                )

                                            }

                                        </div>

                                    )

                                }

                                {

                                    activeLesson.notes_url && (

                                        <a

                                            href={activeLesson.notes_url}

                                            target="_blank"

                                            rel="noreferrer"

                                            className="mt-6 inline-flex items-center gap-2 bg-slate-100 px-5 py-3 rounded-xl hover:bg-slate-200"

                                        >

                                            <FileText size={18} />

                                            Download Notes

                                        </a>

                                    )

                                }

                                <div className="mt-10">
                                                                        {

                                        activeLesson.completed ? (

                                            <span className="inline-flex items-center gap-2 text-green-600 font-semibold">

                                                <CheckCircle2 size={20} />

                                                Lesson Completed

                                            </span>

                                        ) : (

                                            <button

                                                onClick={() =>

                                                    handleMarkComplete(
                                                        activeLesson.id
                                                    )

                                                }

                                                disabled={marking}

                                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-60"

                                            >

                                                {

                                                    marking

                                                        ? "Updating..."

                                                        : "Mark as Complete"

                                                }

                                            </button>

                                        )

                                    }

                                </div>

                            </>

                        ) : (

                            <div className="flex items-center justify-center h-full">

                                <p className="text-slate-500 text-lg">

                                    Select a lesson to begin.

                                </p>

                            </div>

                        )

                    }

                </div>

            </div>

        </LearnerLayout>

    );

}

export default CourseLessons;