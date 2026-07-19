import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Plus,
  Search,
  GripVertical,
  Trash2,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

import LessonForm from "../../components/admin/LessonForm";

import { getCourse, getCourses } from "../../services/courseService";

import {
  getLessonsByCourse,
  createLesson,
  deleteLesson,
} from "../../services/lessonService";

function LessonManagement() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [dragIndex, setDragIndex] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [courseResponse, lessonResponse, coursesResponse] =
        await Promise.all([
          getCourse(courseId),
          getLessonsByCourse(courseId),
          getCourses(),
        ]);

      setCourse(courseResponse);
      setLessons(lessonResponse);
      setAllCourses(coursesResponse);
      setOrderChanged(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      await createLesson(lessonData);
      setOpenForm(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Unable to create lesson.");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const confirmDelete = window.confirm("Delete this lesson?");
    if (!confirmDelete) return;

    try {
      await deleteLesson(lessonId);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete lesson.");
    }
  };

  const visibleLessons = useMemo(() => {
    let result = [...lessons];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(term) ||
          l.description?.toLowerCase().includes(term)
      );
    }

    if (resourceFilter === "video") {
      result = result.filter((l) => l.video_url);
    } else if (resourceFilter === "notes") {
      result = result.filter((l) => l.notes_url);
    }

    return result;
  }, [lessons, search, resourceFilter]);

  // Drag & drop reordering — visual only. There's no reorder/update-order
  // endpoint in lessonService yet, so this reorders the local list for
  // preview purposes but doesn't persist to the backend.
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;

    const next = [...lessons];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);

    setLessons(next);
    setDragIndex(null);
    setOrderChanged(true);
  };

  return (
    <AdminLayout>
      {/* Hero */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <button
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-300 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono text-amber-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {lessons.length} LESSONS
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
            Lesson Management
          </h1>
          <p className="text-slate-400 mt-2">
            {course ? course.title : "Loading..."}
          </p>
        </div>

        <button
          onClick={() => setOpenForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(251,191,36,0.25)] shrink-0"
        >
          <Plus size={20} />
          Add Lesson
        </button>
      </section>

      {/* Course selector + search + filters */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 lg:items-center">
        <select
          value={courseId}
          onChange={(e) => navigate(`/admin/courses/${e.target.value}/lessons`)}
          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors lg:max-w-xs"
        >
          {allCourses.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-900">
              {c.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-lg px-3.5 py-2.5 flex-1 transition-all duration-200">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons..."
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "video", label: "Video" },
            { key: "notes", label: "Notes" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setResourceFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors ${
                resourceFilter === f.key
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {orderChanged && (
        <p className="text-xs font-mono text-amber-300/80 mb-4">
          ⚠ Order updated for preview — this app doesn't have a reorder
          endpoint yet, so it won't persist after a refresh.
        </p>
      )}

      {/* Lesson list — custom drag-and-drop cards. LessonTable.jsx is a
          plain static table with no drag handles / preview / badges, and
          it's off-limits to edit in this task, so the richer list lives
          here instead. */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin/lessons $ loading...
          </p>
        </div>
      ) : visibleLessons.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
          <h3 className="text-xl font-bold text-white">No lessons found</h3>
          <p className="text-slate-400 mt-2">
            {lessons.length === 0
              ? "Add your first lesson to this course."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {visibleLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-all duration-200 ease-[var(--ease-premium)] hover:border-amber-400/25 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} className="text-slate-600 shrink-0" />

              <span className="shrink-0 w-8 h-8 rounded-lg border border-amber-400/25 bg-amber-400/10 text-amber-300 text-sm font-mono font-semibold flex items-center justify-center">
                {lesson.order}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white truncate">
                    {lesson.title}
                  </p>

                  {/* Publish status — only if the API ever provides it */}
                  {typeof lesson.published === "boolean" && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${
                        lesson.published
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-slate-400/30 bg-slate-400/10 text-slate-300"
                      }`}
                    >
                      {lesson.published ? "Published" : "Draft"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1 truncate">
                  {lesson.description}
                </p>

                <div className="flex gap-3 mt-2 text-xs text-slate-500">
                  {lesson.video_url && (
                    <span className="inline-flex items-center gap-1">
                      <Video size={13} /> Video
                    </span>
                  )}
                  {lesson.notes_url && (
                    <span className="inline-flex items-center gap-1">
                      <FileText size={13} /> Notes
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(lesson.video_url || lesson.notes_url) && (
                  <a
                    href={lesson.video_url || lesson.notes_url}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview"
                    className="p-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                  >
                    <ExternalLink size={17} />
                  </a>
                )}

                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  title="Delete"
                  className="p-2.5 rounded-lg border border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/15 transition-colors"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing modal form, unmodified */}
      <LessonForm
        open={openForm}
        courseId={courseId}
        nextOrder={lessons.length + 1}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreateLesson}
      />
    </AdminLayout>
  );
}

export default LessonManagement;