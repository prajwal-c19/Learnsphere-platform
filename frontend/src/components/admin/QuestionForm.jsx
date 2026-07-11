import { useEffect, useState } from "react";

const initialState = {
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A"
};

function QuestionForm({

    open,

    assessmentId,

    onClose,

    onSubmit

}) {

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {

        if (open) {

            setFormData(initialState);

        }

    }, [open]);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            assessment_id: Number(assessmentId),

            ...formData

        });

    };

    if (!open) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

                <h2 className="text-3xl font-bold mb-8">

                    Add Question

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        placeholder="Enter Question"
                        rows={3}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="option_a"
                        value={formData.option_a}
                        onChange={handleChange}
                        placeholder="Option A"
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="option_b"
                        value={formData.option_b}
                        onChange={handleChange}
                        placeholder="Option B"
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="option_c"
                        value={formData.option_c}
                        onChange={handleChange}
                        placeholder="Option C"
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="option_d"
                        value={formData.option_d}
                        onChange={handleChange}
                        placeholder="Option D"
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <select
                        name="correct_answer"
                        value={formData.correct_answer}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    >

                        <option value="A">

                            Option A

                        </option>

                        <option value="B">

                            Option B

                        </option>

                        <option value="C">

                            Option C

                        </option>

                        <option value="D">

                            Option D

                        </option>

                    </select>

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

                            Save Question

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default QuestionForm;
