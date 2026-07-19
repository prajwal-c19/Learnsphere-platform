import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";
import StatCard from "../../components/common/StatCard";

import { getResultHistory } from "../../services/resultService";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResultHistory();
      setResults(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load assessment history.");
    } finally {
      setLoading(false);
    }
  };

  const totalAssessments = results.length;
  const passed = results.filter((result) => result.passed).length;
  const failed = totalAssessments - passed;

  const averageScore =
    totalAssessments > 0
      ? (
          results.reduce((sum, result) => sum + result.percentage, 0) /
          totalAssessments
        ).toFixed(1)
      : 0;

  // Chronological trend for the mini progress chart (oldest → newest).
  const trend = useMemo(() => {
    return [...results]
      .filter((r) => r.submitted_at)
      .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  }, [results]);

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/results $ loading...
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
      <div className="max-w-7xl mx-auto">
        {/* Results hero */}
        <section className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {totalAssessments} ATTEMPTS RECORDED
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Assessment Results
          </h1>
          <p className="font-mono text-sm text-slate-400 mt-3">
            ~/results $ average score {averageScore}%
          </p>
        </section>

        {/* Performance stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Assessments" value={totalAssessments} icon="🗂️" />
          <StatCard title="Passed" value={passed} icon="✅" />
          <StatCard title="Failed" value={failed} icon="❌" />
          <StatCard title="Average Score" value={`${averageScore}%`} icon="📊" />
        </div>

        {/* Progress chart */}
        {trend.length > 1 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Score Trend
            </h2>

            <div className="flex items-end gap-2 sm:gap-3 h-32">
              {trend.map((r, i) => (
                <div
                  key={`${r.assessment_id}-${i}`}
                  className="flex-1 flex flex-col items-center justify-end gap-2 group"
                  title={`${r.percentage}%`}
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ease-[var(--ease-premium)] ${
                      r.passed
                        ? "bg-gradient-to-t from-emerald-500/40 to-emerald-400"
                        : "bg-gradient-to-t from-rose-500/40 to-rose-400"
                    }`}
                    style={{ height: `${Math.max(r.percentage, 4)}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                    {r.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Result cards */}
        <div className="mt-10 space-y-5">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white">
                No Results Found
              </h2>
              <p className="text-slate-400 mt-3">
                Complete an assessment to see your results here.
              </p>
            </div>
          ) : (
            results.map((result) => {
              const hasBreakdown =
                typeof result.correct_answers === "number" &&
                typeof result.wrong_answers === "number";

              return (
                <div
                  key={result.assessment_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 ease-[var(--ease-premium)] hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                          {result.course_name}
                        </h2>

                        {result.passed ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 px-3 py-1 text-xs font-mono font-semibold">
                            ✅ PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-300 px-3 py-1 text-xs font-mono font-semibold">
                            ❌ FAIL
                          </span>
                        )}
                      </div>

                      {result.submitted_at && (
                        <p className="text-slate-400 text-sm mt-2">
                          Attempted on{" "}
                          {new Date(result.submitted_at).toLocaleString()}
                        </p>
                      )}

                      {/* Correct / Wrong summary — only if the API provides it */}
                      {hasBreakdown && (
                        <div className="flex gap-4 mt-3 text-xs font-mono">
                          <span className="text-emerald-300">
                            {result.correct_answers} correct
                          </span>
                          <span className="text-rose-300">
                            {result.wrong_answers} wrong
                          </span>
                        </div>
                      )}

                      {/* Recommendation */}
                      <p className="text-xs text-slate-500 mt-3 font-mono">
                        {result.passed
                          ? "Nice work — keep the momentum going with your next course."
                          : "Review the lessons for this course, then retry when you're ready."}
                      </p>
                    </div>

                    {/* Score breakdown */}
                    <div className="flex gap-8 shrink-0">
                      <div className="text-center">
                        <p className="text-slate-500 text-xs font-mono">
                          Score
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                          {result.score}
                        </h2>
                      </div>

                      <div className="text-center">
                        <p className="text-slate-500 text-xs font-mono">
                          Percentage
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mt-1">
                          {result.percentage}%
                        </h2>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 shrink-0 min-w-[160px]">
                      <button
                        onClick={() =>
                          navigate(`/result/${result.assessment_id}`)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
                      >
                        View Details
                      </button>

                      {result.passed ? (
                        <button
                          onClick={() => navigate("/my-courses")}
                          className="rounded-full border border-white/10 bg-white/[0.05] text-slate-200 px-6 py-2.5 text-sm font-medium hover:bg-white/[0.09] transition-colors"
                        >
                          Continue Learning
                        </button>
                      ) : (
                        result.course_id && (
                          <button
                            onClick={() =>
                              navigate(`/assessment/${result.course_id}`)
                            }
                            className="rounded-full border border-rose-400/30 bg-rose-400/10 text-rose-300 px-6 py-2.5 text-sm font-medium hover:bg-rose-400/20 transition-colors"
                          >
                            Retry Assessment
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </LearnerLayout>
  );
}

export default Results;