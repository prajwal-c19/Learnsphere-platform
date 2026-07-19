import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";
import StatCard from "../../components/common/StatCard";
import ProgressBar from "../../components/common/ProgressBar";

import { getMyAssessments } from "../../services/assessmentService";

function Assessments() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await getMyAssessments();
      setAssessments(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  const totalAssessments = assessments.length;
  const available = assessments.filter((a) => a.available).length;
  const locked = totalAssessments - available;
  const completed = assessments.filter((a) => a.status === "Completed").length;

  const visibleAssessments = useMemo(() => {
    let result = [...assessments];

    if (activeTab === "active") {
      result = result.filter((a) => a.available && a.status !== "Completed");
    } else if (activeTab === "completed") {
      result = result.filter((a) => a.status === "Completed");
    } else if (activeTab === "upcoming") {
      result = result.filter((a) => !a.available);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.course_name?.toLowerCase().includes(term) ||
          a.assessment_title?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [assessments, activeTab, searchTerm]);

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/assessments $ loading...
          </p>
        </div>
      </LearnerLayout>
    );
  }

  if (error) {
    return (
      <LearnerLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <h2 className="text-2xl font-bold text-red-400">{error}</h2>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      {/* Hero */}
      <section className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {totalAssessments} TOTAL ASSESSMENTS
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          Assessment Center
        </h1>
        <p className="font-mono text-sm text-slate-400 mt-3">
          ~/assessments $ track progress --and continue learning
        </p>
      </section>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard title="Assessments" value={totalAssessments} icon="🗂️" />
        <StatCard title="Available" value={available} icon="✅" />
        <StatCard title="Locked" value={locked} icon="🔒" />
        <StatCard title="Completed" value={completed} icon="🏆" />
      </div>

      {/* Tabs + search */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "upcoming", label: "Upcoming" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-mono transition-all duration-200 ${
                activeTab === tab.key
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-cyan-400/40 rounded-xl px-4 py-2.5 w-full lg:max-w-xs transition-all duration-200">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assessments..."
            className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </section>

      {/* Assessment cards */}
      {assessments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Assessments Available
          </h2>
          <p className="text-slate-400 mt-3">
            Enroll in a course to access assessments.
          </p>
        </div>
      ) : visibleAssessments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
          <h2 className="text-xl font-bold text-white">
            No assessments match this view
          </h2>
          <p className="text-slate-400 mt-2">
            Try a different tab or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          {visibleAssessments.map((assessment) => (
            <div
              key={assessment.assessment_id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 ease-[var(--ease-premium)] hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {assessment.course_name}
                    </h2>

                    {/* Difficulty badge — only if the API ever provides it */}
                    {assessment.difficulty && (
                      <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[11px] font-mono text-violet-300">
                        {assessment.difficulty}
                      </span>
                    )}

                    {/* Due date / timer — only if the API ever provides it */}
                    {assessment.due_date && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-mono text-amber-300">
                        Due {assessment.due_date}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400">{assessment.assessment_title}</p>

                  <div className="mt-6 max-w-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-300">
                        Progress
                      </span>
                      <span className="text-cyan-300 font-semibold">
                        {assessment.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={assessment.progress} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 min-w-[260px]">
                  <div>
                    <p className="text-slate-500 text-xs font-mono">Attempts</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {assessment.attempts}
                    </h3>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-mono">Best Score</p>
                    <h3 className="text-2xl font-bold text-cyan-300 mt-1">
                      {assessment.best_score}%
                    </h3>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-mono">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-mono mt-1 border ${
                        assessment.status === "Completed"
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/40 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {assessment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-mono">Assessment</p>
                    {assessment.available ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mt-1 border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
                        ✅ Available
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mt-1 border border-red-400/40 bg-red-400/10 text-red-300">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 shrink-0">
                  {!assessment.available ? (
                    <button
                      disabled
                      className="rounded-full border border-white/10 bg-white/[0.03] text-slate-500 px-6 py-3 text-sm font-semibold cursor-not-allowed"
                    >
                      Locked
                    </button>
                  ) : assessment.attempts > 0 ? (
                    <button
                      onClick={() =>
                        navigate(`/result/${assessment.assessment_id}`)
                      }
                      className="rounded-full bg-emerald-500 text-black px-6 py-3 text-sm font-semibold hover:bg-emerald-400 transition-colors"
                    >
                      View Result
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/assessment/${assessment.course_id}`)
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                      Start Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </LearnerLayout>
  );
}

export default Assessments;