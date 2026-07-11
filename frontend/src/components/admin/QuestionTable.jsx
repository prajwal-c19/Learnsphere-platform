import { Trash2 } from "lucide-react";

function QuestionTable({

    questions,

    onDelete

}) {

    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-900 text-white">

                    <tr>

                        <th className="text-left px-6 py-4">

                            Question

                        </th>

                        <th className="text-left px-6 py-4">

                            Correct Answer

                        </th>

                        <th className="text-center px-6 py-4">

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        questions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="text-center py-10 text-slate-500"
                                >

                                    No Questions Found

                                </td>

                            </tr>

                        ) : (

                            questions.map((question) => (

                                <tr
                                    key={question.id}
                                    className="border-b hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="font-semibold">

                                                {question.question}

                                            </p>

                                            <div className="mt-3 text-sm text-slate-600 space-y-1">

                                                <p>

                                                    <strong>A:</strong> {question.option_a}

                                                </p>

                                                <p>

                                                    <strong>B:</strong> {question.option_b}

                                                </p>

                                                <p>

                                                    <strong>C:</strong> {question.option_c}

                                                </p>

                                                <p>

                                                    <strong>D:</strong> {question.option_d}

                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                            {question.correct_answer}

                                        </span>

                                    </td>

                                    <td className="px-6 py-5 text-center">

                                        <button
                                            onClick={() => onDelete(question.id)}
                                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default QuestionTable;
