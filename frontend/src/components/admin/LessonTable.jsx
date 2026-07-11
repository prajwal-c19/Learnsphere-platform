import { Trash2, Video, FileText } from "lucide-react";

function LessonTable({

    lessons,

    onDelete

}) {

    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-900 text-white">

                    <tr>

                        <th className="text-left px-6 py-4">
                            #
                        </th>

                        <th className="text-left px-6 py-4">
                            Lesson
                        </th>

                        <th className="text-left px-6 py-4">
                            Resources
                        </th>

                        <th className="text-center px-6 py-4">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        lessons.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center py-10 text-slate-500"
                                >

                                    No lessons added yet.

                                </td>

                            </tr>

                        ) : (

                            lessons.map((lesson) => (

                                <tr
                                    key={lesson.id}
                                    className="border-b hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5 font-semibold">

                                        {lesson.order}

                                    </td>

                                    <td className="px-6 py-5">

                                        <p className="font-semibold">

                                            {lesson.title}

                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">

                                            {lesson.description}

                                        </p>

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex gap-3 text-slate-500">

                                            {

                                                lesson.video_url && (

                                                    <span className="flex items-center gap-1 text-sm">

                                                        <Video size={16} />

                                                        Video

                                                    </span>

                                                )

                                            }

                                            {

                                                lesson.notes_url && (

                                                    <span className="flex items-center gap-1 text-sm">

                                                        <FileText size={16} />

                                                        Notes

                                                    </span>

                                                )

                                            }

                                        </div>

                                    </td>

                                    <td className="px-6 py-5 text-center">

                                        <button
                                            onClick={() => onDelete(lesson.id)}
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

export default LessonTable;
