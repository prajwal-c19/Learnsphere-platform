import {
    Pencil,
    Trash2,
    ListChecks
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AssessmentTable({

    assessments,

    courses,

    onEdit,

    onDelete

}) {

    const navigate = useNavigate();

    const getCourseTitle = (courseId) => {

        const course = courses.find(
            (c) => c.id === courseId
        );

        return course
            ? course.title
            : "Unknown Course";

    };

    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-900 text-white">

                    <tr>

                        <th className="text-left px-6 py-4">
                            Assessment
                        </th>

                        <th className="text-left px-6 py-4">
                            Course
                        </th>

                        <th className="text-left px-6 py-4">
                            Questions
                        </th>

                        <th className="text-left px-6 py-4">
                            Pass %
                        </th>

                        <th className="text-center px-6 py-4">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        assessments.length === 0

                            ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-slate-500"
                                    >

                                        No assessments available.

                                    </td>

                                </tr>

                            )

                            : (

                                assessments.map((assessment) => (

                                    <tr
                                        key={assessment.id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-5 font-semibold">

                                            {assessment.title}

                                        </td>

                                        <td className="px-6 py-5">

                                            {getCourseTitle(
                                                assessment.course_id
                                            )}

                                        </td>

                                        <td className="px-6 py-5">

                                            {assessment.total_questions}

                                        </td>

                                        <td className="px-6 py-5">

                                            {assessment.pass_percentage}%

                                        </td>

                                        <td className="px-6 py-5">

                                            <div className="flex justify-center gap-3">

                                                <button

                                                    onClick={() =>

                                                        navigate(

                                                            `/admin/assessments/${assessment.id}/questions`

                                                        )

                                                    }

                                                    className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200"

                                                    title="Manage Questions"

                                                >

                                                    <ListChecks size={18} />

                                                </button>

                                                <button

                                                    onClick={() =>

                                                        onEdit(
                                                            assessment
                                                        )

                                                    }

                                                    className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200"

                                                >

                                                    <Pencil size={18} />

                                                </button>

                                                <button

                                                    onClick={() =>

                                                        onDelete(
                                                            assessment.id
                                                        )

                                                    }

                                                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"

                                                >

                                                    <Trash2 size={18} />

                                                </button>

                                            </div>

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

export default AssessmentTable;
