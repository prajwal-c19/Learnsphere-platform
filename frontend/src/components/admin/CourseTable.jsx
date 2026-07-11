import {
    Pencil,
    Trash2,
    BookOpenCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function CourseTable({

    courses,

    onEdit,

    onDelete

}) {

    const navigate = useNavigate();

    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-900 text-white">

                    <tr>

                        <th className="text-left px-6 py-4">

                            Title

                        </th>

                        <th className="text-left px-6 py-4">

                            Category

                        </th>

                        <th className="text-left px-6 py-4">

                            Format

                        </th>

                        <th className="text-left px-6 py-4">

                            Duration

                        </th>

                        <th className="text-center px-6 py-4">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        courses.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-10 text-slate-500"
                                >

                                    No courses found.

                                </td>

                            </tr>

                        ) : (

                            courses.map((course) => (

                                <tr
                                    key={course.id}
                                    className="border-b hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5 font-semibold">

                                        {course.title}

                                    </td>

                                    <td className="px-6 py-5">

                                        {course.category}

                                    </td>

                                    <td className="px-6 py-5">

                                        {course.format}

                                    </td>

                                    <td className="px-6 py-5">

                                        {course.duration}

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex justify-center gap-3">

                                            <button
                                                onClick={() =>

                                                    navigate(

                                                        `/admin/courses/${course.id}/lessons`

                                                    )

                                                }
                                                className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200"
                                                title="Manage Lessons"
                                            >

                                                <BookOpenCheck size={18} />

                                            </button>

                                            <button
                                                onClick={() => onEdit(course)}
                                                className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200"
                                            >

                                                <Pencil size={18} />

                                            </button>

                                            <button
                                                onClick={() => onDelete(course.id)}
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

export default CourseTable;
