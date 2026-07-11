import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Plus
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

import LessonForm from "../../components/admin/LessonForm";
import LessonTable from "../../components/admin/LessonTable";

import { getCourse } from "../../services/courseService";

import {

    getLessonsByCourse,

    createLesson,

    deleteLesson

} from "../../services/lessonService";

function LessonManagement() {

    const navigate = useNavigate();

    const { courseId } = useParams();

    const [course, setCourse] = useState(null);

    const [lessons, setLessons] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const courseResponse =
                await getCourse(courseId);

            const lessonResponse =
                await getLessonsByCourse(courseId);

            setCourse(courseResponse);

            setLessons(lessonResponse);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load lessons.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleCreateLesson = async (lessonData) => {

        try {

            await createLesson(lessonData);

            setOpenForm(false);

            loadData();

        }

        catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.detail ||

                "Unable to create lesson."

            );

        }

    };

    const handleDeleteLesson = async (lessonId) => {

        const confirmDelete = window.confirm(

            "Delete this lesson?"

        );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteLesson(lessonId);

            loadData();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete lesson.");

        }

    };

    return (

        <AdminLayout>

            <div className="flex items-center justify-between mb-8">

                <div>

                    <button

                        onClick={() =>

                            navigate("/admin/courses")

                        }

                        className="flex items-center gap-2 text-indigo-600 mb-4 hover:underline"

                    >

                        <ArrowLeft size={18} />

                        Back to Courses

                    </button>

                    <h1 className="text-4xl font-bold">

                        Lesson Management

                    </h1>

                    <p className="text-slate-500 mt-2">

                        {

                            course
                                ? course.title
                                : "Loading..."

                        }

                    </p>

                </div>

                <button

                    onClick={() => setOpenForm(true)}

                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"

                >

                    <Plus size={20} />

                    Add Lesson

                </button>

            </div>

            {

                loading ? (

                    <div className="flex justify-center items-center h-96">

                        <p className="text-2xl font-semibold">

                            Loading Lessons...

                        </p>

                    </div>

                ) : (

                    <LessonTable

                        lessons={lessons}

                        onDelete={handleDeleteLesson}

                    />

                )

            }

            <LessonForm

                open={openForm}

                courseId={courseId}

                nextOrder={lessons.length + 1}

                onClose={() => setOpenForm(false)}

                onSubmit={handleCreateLesson}

            />

        </AdminLayout>

    );

}

export default LessonManagement;
