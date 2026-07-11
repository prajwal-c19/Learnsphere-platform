import { useEffect, useState } from "react";

const initialState = {
    title: "",
    description: "",
    category: "",
    duration: "",
    format: "",
    thumbnail: "",
    content_url: ""
};

function CourseForm({

    open,
    onClose,
    onSubmit,
    editingCourse

}) {

    const [course, setCourse] = useState(initialState);

    useEffect(() => {

        if (editingCourse) {

            setCourse({

                title: editingCourse.title,
                description: editingCourse.description,
                category: editingCourse.category,
                duration: editingCourse.duration,
                format: editingCourse.format,
                thumbnail: editingCourse.thumbnail || "",
                content_url: editingCourse.content_url || ""

            });

        }

        else {

            setCourse(initialState);

        }

    }, [editingCourse, open]);

    const handleChange = (e) => {

        setCourse({

            ...course,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(course);

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

                <h2 className="text-3xl font-bold mb-8">

                    {

                        editingCourse

                            ? "Edit Course"

                            : "Add Course"

                    }

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        name="title"
                        placeholder="Course Title"
                        value={course.title}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={course.description}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        rows={4}
                        required
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={course.category}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration"
                        value={course.duration}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="format"
                        placeholder="Format"
                        value={course.format}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="thumbnail"
                        placeholder="Thumbnail URL"
                        value={course.thumbnail}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        type="text"
                        name="content_url"
                        placeholder="Content URL"
                        value={course.content_url}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-slate-300"
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                        >

                            {

                                editingCourse

                                    ? "Update Course"

                                    : "Create Course"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CourseForm;
