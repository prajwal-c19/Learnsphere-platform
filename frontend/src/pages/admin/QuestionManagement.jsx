import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  ListChecks,
  Layers,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

import QuestionForm from "../../components/admin/QuestionForm";

import {
  getAssessment,
  getQuestions,
  createQuestion,
  deleteQuestion,
} from "../../services/assessmentService";

const PAGE_SIZE = 6;

function QuestionManagement() {
  const navigate = useNavigate();
  const { assessmentId } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  const [search, setSearch] = useState("");
  const [answerFilter, setAnswerFilter] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const assessmentResponse = await getAssessment(assessmentId);
      const questionResponse = await getQuestions(assessmentId);

      setAssessment(assessmentResponse);
      setQuestions(questionResponse);
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      await createQuestion(questionData);
      setOpenForm(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Unable to create question.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    try {
      await deleteQuestion(questionId);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete question.");
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === visibleQuestions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleQuestions.map((q) => q.id)));
    }
  };

  // There's no bulk-delete endpoint, so this calls the existing single
  // deleteQuestion for each selected item — real deletes, just sequential.
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selected.size} selected question${
        selected.size === 1 ? "" : "s"
      }?`
    );
    if (!confirmDelete) return;

    try {
      setBulkDeleting(true);
      for (const id of selected) {
        await deleteQuestion(id);
      }
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete one or more questions.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const visibleQuestions = useMemo(() => {
    let result = [...questions];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((q) => q.question?.toLowerCase().includes(term));
    }

    if (answerFilter !== "All") {
      result = result.filter((q) => q.correct_answer === answerFilter);
    }

    return result;
  }, [questions, search, answerFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleQuestions.length / PAGE_SIZE));
  const paginatedQuestions = visibleQuestions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, answerFilter]);

  return (
    <AdminLayout>
      {/* Hero */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <button
            onClick={() => navigate("/admin/assessments")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-300 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Assessments
          </button>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono text-amber-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {questions.length} QUESTIONS IN BANK
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
            Question Management
          </h1>
          <p className="text-slate-400 mt-2">
            {assessment ? assessment.title : "Loading..."}
          </p>
        </div>

        <button
          onClick={() => setOpenForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(251,191,36,0.25)] shrink-0"
        >
          <Plus size={20} />
          Add Question
        </button>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin/questions $ loading...
          </p>
        </div>
      ) : (
        <>
          {/* Question bank overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl border border-blue-400/25 bg-blue-400/10 text-blue-300">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Assessment</p>
                <h3 className="text-lg font-bold text-white truncate max-w-[180px]">
                  {assessment?.title}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-300">
                <ListChecks size={22} />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Questions Allowed</p>
                <h3 className="text-2xl font-bold text-white">
                  {assessment?.total_questions}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                <ListChecks size={22} />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Current Questions</p>
                <h3 className="text-2xl font-bold text-white">
                  {questions.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Search + filters + bulk actions */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-lg px-3.5 py-2.5 flex-1 transition-all duration-200">
                <Search size={16} className="text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <select
                value={answerFilter}
                onChange={(e) => setAnswerFilter(e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors"
              >
                {["All", "A", "B", "C", "D"].map((a) => (
                  <option key={a} value={a} className="bg-slate-900">
                    {a === "All" ? "All Answers" : `Answer ${a}`}
                  </option>
                ))}
              </select>
            </div>

            {selected.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 text-red-300 px-4 py-2.5 text-sm font-medium hover:bg-red-400/20 disabled:opacity-50 transition-colors shrink-0"
              >
                <Trash2 size={16} />
                {bulkDeleting
                  ? "Deleting..."
                  : `Delete Selected (${selected.size})`}
              </button>
            )}
          </section>

          {/* Question list — custom cards. QuestionTable.jsx is a static
              table with no select-checkboxes / badge support, and it's
              off-limits to edit in this task, so bulk-select lives here. */}
          {visibleQuestions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
              <h3 className="text-xl font-bold text-white">
                No questions found
              </h3>
              <p className="text-slate-400 mt-2">
                {questions.length === 0
                  ? "Add your first question to this assessment."
                  : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            <>
              <label className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={
                    selected.size === visibleQuestions.length &&
                    visibleQuestions.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                Select all on this page
              </label>

              <div className="space-y-3 animate-fade-in">
                {paginatedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all duration-200 ease-[var(--ease-premium)] ${
                      selected.has(question.id)
                        ? "border-amber-400/40 bg-amber-400/[0.06]"
                        : "border-white/10 bg-white/[0.04] hover:border-amber-400/20"
                    }`}
                  >
                    <div className="flex gap-4">
                      <input
                        type="checkbox"
                        checked={selected.has(question.id)}
                        onChange={() => toggleSelect(question.id)}
                        className="w-4 h-4 mt-1.5 rounded accent-amber-400 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <p className="font-semibold text-white">
                            {question.question}
                          </p>

                          {/* Difficulty / category — only if the API ever provides them */}
                          {question.difficulty && (
                            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-mono text-violet-300">
                              {question.difficulty}
                            </span>
                          )}
                          {question.category && (
                            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-[10px] font-mono text-sky-300">
                              #{question.category}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-400">
                          {[
                            ["A", question.option_a],
                            ["B", question.option_b],
                            ["C", question.option_c],
                            ["D", question.option_d],
                          ].map(([key, value]) => (
                            <p
                              key={key}
                              className={
                                question.correct_answer === key
                                  ? "text-emerald-300 font-medium"
                                  : ""
                              }
                            >
                              <strong className="font-mono mr-1.5">
                                {key}:
                              </strong>
                              {value}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 px-3 py-1 text-xs font-mono">
                          ✓ {question.correct_answer}
                        </span>

                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          title="Delete"
                          className="p-2.5 rounded-lg border border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/15 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {visibleQuestions.length > PAGE_SIZE && (
                <div className="flex items-center justify-between mt-5 text-sm">
                  <p className="text-slate-500 font-mono text-xs">
                    Page {page} of {totalPages} · {visibleQuestions.length} questions
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
            </>
          )}
        </>
      )}

      {/* Existing modal form, unmodified */}
      <QuestionForm
        open={openForm}
        assessmentId={assessmentId}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreateQuestion}
      />
    </AdminLayout>
  );
}

export default QuestionManagement;