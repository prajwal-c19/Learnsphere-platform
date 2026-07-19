import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCw, BookOpen, CheckCircle2, FileEdit } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

import CourseForm from "../../components/admin/CourseForm";
import CourseTable from "../../components/admin/CourseTable";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/courseService";

const PAGE_SIZE = 8;

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      setCourses(response);
    } catch (error) {
      console.error(error);
      alert("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["All", ...unique];
  }, [courses]);

  const formats = useMemo(() => {
    const unique = new Set(courses.map((c) => c.format).filter(Boolean));
    return ["All", ...unique];
  }, [courses]);

  const publishedCount = courses.filter((c) => c.published).length;
  const draftCount = courses.length - publishedCount;

  const filteredCourses = useMemo(() => {
    let result = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase())
    );

    if (categoryFilter !== "All") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (formatFilter !== "All") {
      result = result.filter((c) => c.format === formatFilter);
    }

    if (sortBy === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "category") {
      result = [...result].sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "duration") {
      result = [...result].sort((a, b) =>
        (a.duration || "").localeCompare(b.duration || "")
      );
    }

    return result;
  }, [courses, search, categoryFilter, formatFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, formatFilter, sortBy]);

  const handleCreate = () => {
    setEditingCourse(null);
    setOpenForm(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete course.");
    }
  };

  const handleSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await createCourse(courseData);
      }
      setOpenForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    }
  };

  return (
    <AdminLayout>
      {/* Hero */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono text-amber-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {courses.length} TOTAL COURSES
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
            Course Management
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchCourses}
            title="Refresh"
            className="p-3 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(251,191,36,0.25)]"
          >
            <Plus size={20} />
            Add Course
          </button>
        </div>
      </section>

      {/* Course overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-blue-400/25 bg-blue-400/10 text-blue-300">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total Courses</p>
            <h3 className="text-2xl font-bold text-white">{courses.length}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Published</p>
            <h3 className="text-2xl font-bold text-white">{publishedCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-slate-400/25 bg-slate-400/10 text-slate-300">
            <FileEdit size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Draft</p>
            <h3 className="text-2xl font-bold text-white">{draftCount}</h3>
          </div>
        </div>
      </div>

      {/* Search, filters, sort */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 space-y-4">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-xl px-4 py-2.5 transition-all duration-200">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors"
          >
            {formats.map((f) => (
              <option key={f} value={f} className="bg-slate-900">
                {f === "All" ? "All Formats" : f}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors ml-auto"
          >
            <option value="title" className="bg-slate-900">Sort: Title</option>
            <option value="category" className="bg-slate-900">Sort: Category</option>
            <option value="duration" className="bg-slate-900">Sort: Duration</option>
          </select>
        </div>
      </section>

      {/* Table (existing component, unmodified) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin/courses $ loading...
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <CourseTable
            courses={paginatedCourses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {filteredCourses.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-5 text-sm">
              <p className="text-slate-500 font-mono text-xs">
                Page {page} of {totalPages} · {filteredCourses.length} courses
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Existing modal form, unmodified */}
      <CourseForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSubmit}
        editingCourse={editingCourse}
      />
    </AdminLayout>
  );
}

export default Courses;