import { useMemo, useState } from "react";

import {

    Pencil,

    Trash2,

    ListChecks,

    Search,

    ArrowUpDown,

    MoreVertical,

    CheckCircle2,

    AlertCircle,

    ChevronLeft,

    ChevronRight

} from "lucide-react";

import { useNavigate } from "react-router-dom";


const PAGE_SIZE = 5;


function getDifficulty(passPercentage) {

    if (passPercentage >= 80) {

        return { label: "Hard", className: "bg-rose-50 text-rose-700 border-rose-200" };

    }

    if (passPercentage >= 60) {

        return { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" };

    }

    return { label: "Easy", className: "bg-lime-50 text-lime-700 border-lime-200" };

}


function AssessmentTable({

    assessments,

    courses,

    onEdit,

    onDelete

}) {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [sortField, setSortField] = useState("title");

    const [sortDirection, setSortDirection] = useState("asc");

    const [page, setPage] = useState(1);

    const [openMenuId, setOpenMenuId] = useState(null);

    const getCourseTitle = (courseId) => {

        const course = courses.find(

            (c) => c.id === courseId

        );

        return course

            ? course.title

            : "Unknown Course";

    };

    const handleSort = (field) => {

        if (sortField === field) {

            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

        } else {

            setSortField(field);

            setSortDirection("asc");

        }

        setPage(1);

    };

    const filteredAssessments = useMemo(() => {

        const term = search.trim().toLowerCase();

        const filtered = !term

            ? assessments

            : assessments.filter(

                (a) =>

                    a.title?.toLowerCase().includes(term) ||

                    getCourseTitle(a.course_id).toLowerCase().includes(term)

            );

        const sorted = [...filtered].sort((a, b) => {

            let valueA = a[sortField];

            let valueB = b[sortField];

            if (sortField === "title") {

                valueA = valueA?.toLowerCase() || "";

                valueB = valueB?.toLowerCase() || "";

            }

            if (sortField === "course") {

                valueA = getCourseTitle(a.course_id).toLowerCase();

                valueB = getCourseTitle(b.course_id).toLowerCase();

            }

            if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;

            if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;

            return 0;

        });

        return sorted;

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [assessments, search, sortField, sortDirection, courses]);

    const totalPages = Math.max(1, Math.ceil(filteredAssessments.length / PAGE_SIZE));

    const paginatedAssessments = filteredAssessments.slice(

        (page - 1) * PAGE_SIZE,

        page * PAGE_SIZE

    );

    return (

        <div

            className="
                relative overflow-visible
                rounded-2xl
                bg-white/70 backdrop-blur-xl
                border border-white/40
                shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]
            "

        >

            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="relative w-full sm:max-w-xs">

                    <Search

                        size={16}

                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) => {

                            setSearch(e.target.value);

                            setPage(1);

                        }}

                        placeholder="Search assessments..."

                        className="
                            w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500
                        "

                    />

                </div>

                <p className="text-xs font-medium text-slate-400">

                    {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? "s" : ""}

                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full min-w-[640px]">

                    <thead className="bg-gradient-to-r from-slate-900 to-cyan-950 text-white">

                        <tr>

                            <th className="px-6 py-4 text-left">

                                <button

                                    type="button"

                                    onClick={() => handleSort("title")}

                                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:text-cyan-300"

                                >
                                    Assessment
                                    <ArrowUpDown size={12} />
                                </button>

                            </th>

                            <th className="px-6 py-4 text-left">

                                <button

                                    type="button"

                                    onClick={() => handleSort("course")}

                                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:text-cyan-300"

                                >
                                    Course
                                    <ArrowUpDown size={12} />
                                </button>

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">
                                Difficulty
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            paginatedAssessments.length === 0

                                ? (

                                    <tr>

                                        <td

                                            colSpan="5"

                                            className="py-14 text-center text-sm text-slate-500"

                                        >

                                            {search ? "No assessments match your search." : "No assessments available."}

                                        </td>

                                    </tr>

                                )

                                : (

                                    paginatedAssessments.map((assessment) => {

                                        const difficulty = getDifficulty(assessment.pass_percentage);

                                        return (

                                            <tr

                                                key={assessment.id}

                                                className="
                                                    group border-b border-slate-100
                                                    transition-colors duration-200
                                                    hover:bg-cyan-50/50
                                                "

                                            >

                                                <td className="px-6 py-5">

                                                    <p className="font-semibold text-slate-800">

                                                        {assessment.title}

                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">

                                                        {assessment.total_questions} questions &middot; {assessment.pass_percentage}% to pass

                                                    </p>

                                                </td>

                                                <td className="px-6 py-5 text-slate-600">

                                                    {getCourseTitle(assessment.course_id)}

                                                </td>

                                                <td className="px-6 py-5">

                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${difficulty.className}`}
                                                    >
                                                        {difficulty.label}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5">

                                                    {

                                                        assessment.total_questions > 0 ? (

                                                            <span
                                                                className="
                                                                    inline-flex items-center gap-1.5 rounded-full
                                                                    border border-emerald-200 bg-emerald-50 px-2.5 py-1
                                                                    text-xs font-semibold text-emerald-700
                                                                "
                                                            >
                                                                <CheckCircle2 size={12} />
                                                                Ready
                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    inline-flex items-center gap-1.5 rounded-full
                                                                    border border-slate-200 bg-slate-50 px-2.5 py-1
                                                                    text-xs font-semibold text-slate-500
                                                                "
                                                            >
                                                                <AlertCircle size={12} />
                                                                Draft
                                                            </span>

                                                        )

                                                    }

                                                </td>

                                                <td className="relative px-6 py-5 text-center">

                                                    <button

                                                        type="button"

                                                        onClick={() =>

                                                            setOpenMenuId((prev) => (prev === assessment.id ? null : assessment.id))

                                                        }

                                                        className="
                                                            inline-flex h-9 w-9 items-center justify-center rounded-lg
                                                            text-slate-500
                                                            transition-colors duration-200
                                                            hover:bg-slate-100
                                                        "

                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {

                                                        openMenuId === assessment.id && (

                                                            <div
                                                                className="
                                                                    absolute right-6 top-14 z-20 w-48
                                                                    rounded-xl border border-slate-100 bg-white
                                                                    py-1.5 text-left shadow-lg
                                                                "
                                                            >

                                                                <button

                                                                    type="button"

                                                                    onClick={() => {

                                                                        navigate(

                                                                            `/admin/assessments/${assessment.id}/questions`

                                                                        );

                                                                        setOpenMenuId(null);

                                                                    }}

                                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"

                                                                >
                                                                    <ListChecks size={14} />
                                                                    Manage Questions
                                                                </button>

                                                                <button

                                                                    type="button"

                                                                    onClick={() => {

                                                                        onEdit(assessment);

                                                                        setOpenMenuId(null);

                                                                    }}

                                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"

                                                                >
                                                                    <Pencil size={14} />
                                                                    Edit
                                                                </button>

                                                                <button

                                                                    type="button"

                                                                    onClick={() => {

                                                                        onDelete(assessment.id);

                                                                        setOpenMenuId(null);

                                                                    }}

                                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"

                                                                >
                                                                    <Trash2 size={14} />
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        )

                                                    }

                                                </td>

                                            </tr>

                                        );

                                    })

                                )

                        }

                    </tbody>

                </table>

            </div>

            {/* Pagination */}
            {

                filteredAssessments.length > 0 && (

                    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">

                        <p className="text-xs text-slate-400">

                            Page {page} of {totalPages}

                        </p>

                        <div className="flex items-center gap-2">

                            <button

                                type="button"

                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}

                                disabled={page === 1}

                                className="
                                    inline-flex h-8 w-8 items-center justify-center rounded-lg
                                    border border-slate-200 text-slate-500
                                    transition-colors duration-200
                                    hover:bg-slate-50
                                    disabled:opacity-40
                                "

                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button

                                type="button"

                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}

                                disabled={page === totalPages}

                                className="
                                    inline-flex h-8 w-8 items-center justify-center rounded-lg
                                    border border-slate-200 text-slate-500
                                    transition-colors duration-200
                                    hover:bg-slate-50
                                    disabled:opacity-40
                                "

                            >
                                <ChevronRight size={16} />
                            </button>

                        </div>

                    </div>

                )

            }

        </div>

    );

}

export default AssessmentTable;