import { useEffect, useState } from "react";
import { generateCourseDescription } from "../../services/courseService";

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
    const [generating, setGenerating] = useState(false);

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

    const handleGenerateDescription = async () => {

        if (!course.title.trim()) {

            alert("Please enter the course title first.");

            return;

        }

        try {

            setGenerating(true);

            const response = await generateCourseDescription(
                course.title
            );

            setCourse({

                ...course,

                description: response.description

            });

        }

        catch (error) {

            console.error(error);

            alert("Failed to generate description.");

        }

        finally {

            setGenerating(false);

        }

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

                    <div>

                        <div className="flex justify-between items-center mb-2">

                            <label className="font-medium">

                                Description

                            </label>

                            <button

                                type="button"

                                onClick={handleGenerateDescription}

                                disabled={generating}

                                className="text-indigo-600 font-medium hover:underline disabled:opacity-50"

                            >

                                {

                                    generating

                                        ? "Generating..."

                                        : "✨ Generate Description"

                                }

                            </button>

                        </div>

                        <textarea

                            name="description"

                            placeholder="Description"

                            value={course.description}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                            rows={6}

                            required

                        />

                    </div>

                    <input
                        type="text"
                        name="category"
                        placeholder="tags"
                        value={course.category}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration (in minutes)"
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
