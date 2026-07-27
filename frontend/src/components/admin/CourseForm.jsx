import { useEffect, useState } from "react";
import {

    generateCourseDescription,

    generateThumbnail

} from "../../services/courseService";

const initialState = {
    title: "",
    description: "",
    category: "",
    duration: "",
    format: "",
    thumbnail: "",
 
};

function CourseForm({

    open,
    onClose,
    onSubmit,
    editingCourse

}) {

    const [course, setCourse] = useState(initialState);
    const [generating, setGenerating] = useState(false);
    const [generatingThumbnail, setGeneratingThumbnail] = useState(false);

    useEffect(() => {

        if (editingCourse) {

            setCourse({

                title: editingCourse.title,
                description: editingCourse.description,
                category: editingCourse.category,
                duration: editingCourse.duration,
                format: editingCourse.format,
                thumbnail: editingCourse.thumbnail || "",
               

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

    alert(

        error?.response?.data?.detail ||

        "Failed to generate description."

    );

}

        finally {

            setGenerating(false);

        }

    };

    const handleGenerateThumbnail = async () => {

        if (!course.title.trim()) {

            alert("Please enter the course title first.");

            return;

        }

        if (!course.category.trim()) {

            alert("Please enter the category.");

            return;

        }

        try {

            setGeneratingThumbnail(true);

            const response = await generateThumbnail(

                course.title,

                course.category

            );

            setCourse({

                ...course,

                thumbnail: response.thumbnail_url

            });

        }

        catch (error) {

            console.error(error);

            alert("Failed to generate thumbnail.");

        }

        finally {

            setGeneratingThumbnail(false);

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
                    
                    <label className="block mb-2 font-medium">
                         Tags
                    </label>

                    <input
                        type="text"
                        name="category"
                        placeholder="Tags (comma separated)"
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

                    <div>

                        <div className="flex justify-between items-center mb-3">

                            <label className="font-medium">

                                Course Thumbnail

                            </label>

                            <button

                                type="button"

                                onClick={handleGenerateThumbnail}

                                disabled={generatingThumbnail}

                                className="text-indigo-600 font-medium hover:underline disabled:opacity-50"

                            >

                                {

                                    generatingThumbnail

                                        ? "Generating..."

                                        : "🎨 Generate Thumbnail"

                                }

                            </button>

                        </div>

                        {

                            course.thumbnail ? (

                                <img

                                    src={`http://127.0.0.1:8000${course.thumbnail}`}

                                    alt="Thumbnail"

                                    className="w-full h-56 object-cover rounded-xl border"

                                />

                            ) : (

                                <div className="w-full h-56 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">

                                    No Thumbnail Generated

                                </div>

                            )

                        }

                    </div>

                    

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
