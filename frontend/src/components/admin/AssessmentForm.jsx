import { useEffect, useState } from "react";

const initialState = {
    course_id: "",
    title: "",
    total_questions: 10,
    pass_percentage: 80
};

function AssessmentForm({

    open,
    onClose,
    onSubmit,
    editingAssessment,
    courses

}) {

    const [assessment, setAssessment] = useState(initialState);

    useEffect(() => {

        if (editingAssessment) {

            setAssessment({

                course_id: editingAssessment.course_id,
                title: editingAssessment.title,
                total_questions: editingAssessment.total_questions,
                pass_percentage: editingAssessment.pass_percentage

            });

        }

        else {

            setAssessment(initialState);

        }

    }, [editingAssessment, open]);

    const handleChange = (e) => {

        setAssessment({

            ...assessment,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            ...assessment,

            course_id: Number(assessment.course_id),
            total_questions: Number(assessment.total_questions),
            pass_percentage: Number(assessment.pass_percentage)

        });

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">

                <h2 className="text-3xl font-bold mb-8">

                    {

                        editingAssessment

                            ? "Edit Assessment"

                            : "Create Assessment"

                    }

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <select
                        name="course_id"
                        value={assessment.course_id}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    >

                        <option value="">

                            Select Course

                        </option>

                        {

                            courses.map((course) => (

                                <option
                                    key={course.id}
                                    value={course.id}
                                >

                                    {course.title}

                                </option>

                            ))

                        }

                    </select>

                    <input
                        type="text"
                        name="title"
                        placeholder="Assessment Title"
                        value={assessment.title}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="number"
                        name="total_questions"
                        value={assessment.total_questions}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        min="1"
                        required
                    />

                    <input
                        type="number"
                        name="pass_percentage"
                        value={assessment.pass_percentage}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        min="1"
                        max="100"
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

                            {

                                editingAssessment

                                    ? "Update Assessment"

                                    : "Create Assessment"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AssessmentForm;
