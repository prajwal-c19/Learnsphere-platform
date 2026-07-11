import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

import CourseForm from "../../components/admin/CourseForm";
import CourseTable from "../../components/admin/CourseTable";

import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../../services/courseService";

function Courses() {

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openForm, setOpenForm] = useState(false);

    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {

        fetchCourses();

    }, []);

    const fetchCourses = async () => {

        try {

            const response = await getCourses();

            setCourses(response);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load courses.");

        }

        finally {

            setLoading(false);

        }

    };

    const filteredCourses = useMemo(() => {

        return courses.filter((course) =>

            course.title
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            course.category
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [courses, search]);

    const handleCreate = () => {

        setEditingCourse(null);

        setOpenForm(true);

    };

    const handleEdit = (course) => {

        setEditingCourse(course);

        setOpenForm(true);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) return;

        try {

            await deleteCourse(id);

            fetchCourses();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete course.");

        }

    };

    const handleSubmit = async (courseData) => {

        try {

            if (editingCourse) {

                await updateCourse(
                    editingCourse.id,
                    courseData
                );

            }

            else {

                await createCourse(courseData);

            }

            setOpenForm(false);

            setEditingCourse(null);

            fetchCourses();

        }

        catch (error) {

            console.error(error);

            alert("Operation failed.");

        }

    };

    return (

        <AdminLayout>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        Course Management

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Total Courses : {courses.length}

                    </p>

                </div>

                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"
                >

                    <Plus size={20} />

                    Add Course

                </button>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                <div className="flex items-center gap-3">

                    <Search
                        size={20}
                        className="text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full outline-none"
                    />

                </div>

            </div>

            {

                loading

                    ?

                    (

                        <div className="text-center text-2xl">

                            Loading Courses...

                        </div>

                    )

                    :

                    (

                        <CourseTable

                            courses={filteredCourses}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    )

            }

            <CourseForm

                open={openForm}

                onClose={() => {

                    setOpenForm(false);

                    setEditingCourse(null);

                }}

                onSubmit={handleSubmit}

                editingCourse={editingCourse}

            />

        </AdminLayout>

    );

}

export default Courses;
