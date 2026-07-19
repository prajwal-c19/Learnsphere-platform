import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";
import StatCard from "../../components/common/StatCard";
import ProgressBar from "../../components/common/ProgressBar";

import { getMyEnrollments } from "../../services/enrollmentService";

function MyCourses() {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await getMyEnrollments();
      setEnrollments(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  const completedCount = useMemo(
    () => enrollments.filter((e) => e.status === "Completed").length,
    [enrollments]
  );

  const inProgressCount = enrollments.length - completedCount;

  const avgProgress = useMemo(() => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
    return Math.round(total / enrollments.length);
  }, [enrollments]);

  const continueEnrollment = useMemo(
    () => enrollments.find((e) => e.status !== "Completed"),
    [enrollments]
  );

  const visibleEnrollments = useMemo(() => {
    let result = [...enrollments];

    if (activeTab === "inProgress") {
      result = result.filter((e) => e.status !== "Completed");
    } else if (activeTab === "completed") {
      result = result.filter((e) => e.status === "Completed");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((e) =>
        e.course.title?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [enrollments, activeTab, searchTerm]);

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/my-courses $ loading...
          </p>
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
          {enrollments.length} ENROLLED
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          My Courses
        </h1>
        <p className="font-mono text-sm text-slate-400 mt-3">
          ~/my-courses $ continue learning from where you left off
        </p>
      </section>

      {enrollments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white">No Courses Yet 📚</h2>
          <p className="text-slate-400 mt-3">
            Enroll in a course to start learning.
          </p>
        </div>
      ) : (
        <>
          {/* Progress overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <StatCard title="Enrolled" value={enrollments.length} icon="📚" />
            <StatCard title="In Progress" value={inProgressCount} icon="⏳" />
            <StatCard title="Avg. Progress" value={`${avgProgress}%`} icon="📈" />
          </div>

          {/* Continue Learning */}
          {continueEnrollment && (
            <section className="mb-10">
              <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Continue Learning
              </h2>

              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate">
                    {continueEnrollment.course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {continueEnrollment.course.description}
                  </p>
                  <div className="mt-4 max-w-sm">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progress</span>
                      <span className="text-cyan-300 font-semibold">
                        {continueEnrollment.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={continueEnrollment.progress} />
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/course/${continueEnrollment.course.id}/lessons`)
                  }
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black text-sm font-semibold px-6 py-3 transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                >
                  Continue Learning →
                </button>
              </div>
            </section>
          )}

          {/* Tabs + search */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              {[
                { key: "all", label: "All" },
                { key: "inProgress", label: "In Progress" },
                { key: "completed", label: "Completed" },
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
                placeholder="Search your courses..."
                className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </section>

          {/* Course grid */}
          {visibleEnrollments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">
              <h3 className="text-xl font-bold text-white">
                No courses match this view
              </h3>
              <p className="text-slate-400 mt-2">
                Try a different tab or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in">
              {visibleEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 ease-[var(--ease-premium)] hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {enrollment.course.title}
                    </h2>

                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono ${
                        enrollment.status === "Completed"
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/40 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                    {enrollment.course.description}
                  </p>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progress</span>
                      <span className="text-cyan-300 font-semibold">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={enrollment.progress} />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 mt-5 font-mono">
                    <span>#{enrollment.course.category}</span>
                    <span>{enrollment.course.format}</span>
                  </div>

                  {enrollment.status === "Completed" ? (
                    <div className="mt-6 w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 px-5 py-3 text-center font-semibold text-sm">
                      ✔ Course Completed
                    </div>
                  ) : enrollment.progress < 80 ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/course/${enrollment.course.id}/lessons`)
                        }
                        className="mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black text-sm font-semibold px-5 py-3 transition-transform duration-200 hover:scale-105 active:scale-95"
                      >
                        Continue Learning →
                      </button>
                      <p className="text-xs text-amber-400/80 mt-3 text-center font-mono">
                        🔒 Assessment unlocks at 80% progress.
                      </p>
                    </>
                  ) : (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          navigate(`/course/${enrollment.course.id}/lessons`)
                        }
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 px-4 py-3 text-sm font-medium hover:bg-white/[0.09] transition-colors"
                      >
                        Review Lessons
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/assessment/${enrollment.course.id}`)
                        }
                        className="flex-1 rounded-xl bg-emerald-500 text-black px-4 py-3 text-sm font-semibold hover:bg-emerald-400 transition-colors"
                      >
                        📝 Start Assessment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </LearnerLayout>
  );
}

export default MyCourses;