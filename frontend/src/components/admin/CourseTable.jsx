import { useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  BookOpenCheck,
  MoreVertical,
  Search,
  ImageOff,
  ArrowUpDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 6;

function CourseTable({ courses, onEdit, onDelete }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const safeCourses = Array.isArray(courses) ? courses : [];

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const processedCourses = useMemo(() => {
    let result = safeCourses.filter((course) =>
      (course.title || "").toLowerCase().includes(search.toLowerCase())
    );

    result = [...result].sort((a, b) => {
      const aVal = (a[sortBy] || "").toString().toLowerCase();
      const bVal = (b[sortBy] || "").toString().toLowerCase();
      const compare = aVal.localeCompare(bVal);
      return sortDir === "asc" ? compare : -compare;
    });

    return result;
  }, [safeCourses, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processedCourses.length / PAGE_SIZE));
  const paginatedCourses = processedCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDeleteClick = async (id) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const SortHeader = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={12}
        className={sortBy === field ? "text-amber-300" : "text-slate-600"}
      />
    </button>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      {/* Search */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-lg px-3.5 py-2.5 max-w-sm transition-all duration-200">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search table..."
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-mono uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">
                <SortHeader field="title" label="Course" />
              </th>
              <th className="px-6 py-4">
                <SortHeader field="category" label="Category" />
              </th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCourses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14 text-slate-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              paginatedCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-white/5 last:border-0 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/[0.03] shrink-0 flex items-center justify-center">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff size={16} className="text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[220px]">
                          {course.title}
                        </p>

                        {typeof course.enrollment_count === "number" && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {course.enrollment_count} enrolled
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-sky-400/25 bg-sky-400/10 text-sky-300 px-2.5 py-1 text-xs font-mono">
                      {course.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {course.format}
                  </td>

                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {course.duration}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-mono ${
                        course.published
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-slate-400/30 bg-slate-400/10 text-slate-300"
                      }`}
                    >
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Action menu */}
                  <td className="px-6 py-4">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === course.id ? null : course.id
                          )
                        }
                        disabled={deletingId === course.id}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-colors disabled:opacity-40"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === course.id && (
                        <>
                          <button
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setOpenMenuId(null)}
                            aria-label="Close menu"
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 animate-fade-in">
                            <button
                              onClick={() => {
                                navigate(`/admin/courses/${course.id}/lessons`);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06] transition-colors"
                            >
                              <BookOpenCheck size={16} className="text-blue-300" />
                              Manage Lessons
                            </button>
                            <button
                              onClick={() => {
                                onEdit(course);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06] transition-colors"
                            >
                              <Pencil size={16} className="text-amber-300" />
                              Edit Course
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDeleteClick(course.id);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-400/10 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedCourses.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-t border-white/10 text-sm">
          <p className="text-slate-500 font-mono text-xs">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseTable;