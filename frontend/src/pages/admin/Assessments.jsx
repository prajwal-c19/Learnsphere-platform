import { useEffect, useMemo, useState } from "react";
import { Plus, Search, ClipboardList, Layers, Target, RefreshCw } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

import AssessmentForm from "../../components/admin/AssessmentForm";
import AssessmentTable from "../../components/admin/AssessmentTable";

import { getCourses } from "../../services/courseService";

import {
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "../../services/assessmentService";

const PAGE_SIZE = 8;

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  const [courseFilter, setCourseFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const assessmentResponse = await getAllAssessments();
      const courseResponse = await getCourses();

      setAssessments(assessmentResponse);
      setCourses(courseResponse);
    } catch (error) {
      console.error(error);
      alert("Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    let result = assessments.filter((assessment) =>
      assessment.title.toLowerCase().includes(search.toLowerCase())
    );

    if (courseFilter !== "All") {
      result = result.filter(
        (a) => a.course_id === Number(courseFilter)
      );
    }

    return result;
  }, [assessments, search, courseFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssessments.length / PAGE_SIZE)
  );
  const paginatedAssessments = filteredAssessments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, courseFilter]);

  const avgPassPercentage = useMemo(() => {
    if (assessments.length === 0) return 0;
    return Math.round(
      assessments.reduce((sum, a) => sum + a.pass_percentage, 0) /
        assessments.length
    );
  }, [assessments]);

  const avgQuestions = useMemo(() => {
    if (assessments.length === 0) return 0;
    return Math.round(
      assessments.reduce((sum, a) => sum + a.total_questions, 0) /
        assessments.length
    );
  }, [assessments]);

  const handleCreate = () => {
    setEditingAssessment(null);
    setOpenForm(true);
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this assessment?");
    if (!confirmDelete) return;

    try {
      await deleteAssessment(id);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete assessment.");
    }
  };

  const handleSubmit = async (assessmentData) => {
    try {
      if (editingAssessment) {
        await updateAssessment(editingAssessment.id, assessmentData);
      } else {
        await createAssessment(assessmentData);
      }
      setOpenForm(false);
      setEditingAssessment(null);
      loadData();
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
            {assessments.length} TOTAL ASSESSMENTS
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
            Assessment Management
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
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
            Add Assessment
          </button>
        </div>
      </section>

      {/* Assessment overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-blue-400/25 bg-blue-400/10 text-blue-300">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total Assessments</p>
            <h3 className="text-2xl font-bold text-white">
              {assessments.length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <Target size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Avg. Pass %</p>
            <h3 className="text-2xl font-bold text-white">
              {avgPassPercentage}%
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-300">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Avg. Questions</p>
            <h3 className="text-2xl font-bold text-white">{avgQuestions}</h3>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-lg px-3.5 py-2.5 flex-1 transition-all duration-200">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search assessment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors lg:max-w-xs"
        >
          <option value="All" className="bg-slate-900">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-900">
              {c.title}
            </option>
          ))}
        </select>
      </section>

      {/* Existing table, unmodified */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin/assessments $ loading...
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <AssessmentTable
            assessments={paginatedAssessments}
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {filteredAssessments.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-5 text-sm">
              <p className="text-slate-500 font-mono text-xs">
                Page {page} of {totalPages} · {filteredAssessments.length} assessments
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
      <AssessmentForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingAssessment(null);
        }}
        onSubmit={handleSubmit}
        editingAssessment={editingAssessment}
        courses={courses}
      />
    </AdminLayout>
  );
}

export default Assessments;