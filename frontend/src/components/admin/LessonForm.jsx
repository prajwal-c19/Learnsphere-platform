import { useEffect, useState } from "react";

const initialState = {
    title: "",
    description: "",
    video_url: "",
    notes_url: "",
    order: 1
};

function LessonForm({

    open,

    courseId,

    onClose,

    onSubmit,

    nextOrder

}) {

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {

        if (open) {

            setFormData({
                ...initialState,
                order: nextOrder || 1
            });

        }

    }, [open, nextOrder]);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            course_id: Number(courseId),

            ...formData,

            order: Number(formData.order)

        });

    };

    if (!open) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

                <h2 className="text-3xl font-bold mb-8">

                    Add Lesson

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        name="title"
                        placeholder="Lesson Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        type="text"
                        name="video_url"
                        placeholder="YouTube Video URL"
                        value={formData.video_url}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        type="text"
                        name="notes_url"
                        placeholder="Notes / PDF URL (Google Drive link)"
                        value={formData.notes_url}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        type="number"
                        name="order"
                        placeholder="Lesson Order"
                        value={formData.order}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        min="1"
                        required
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

                            Save Lesson

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default LessonForm;
