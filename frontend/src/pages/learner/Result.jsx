import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Award } from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";
import API from "../../api/axios";

import { downloadCertificate } from "../../services/certificateService";

function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function Result() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const response = await API.get(`/results/assessment/${assessmentId}`);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load assessment result.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setDownloading(true);
      await downloadCertificate(assessmentId);
    } catch (error) {
      console.error(error);
      alert("Failed to download certificate.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/result $ loading...
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

  const grade = getGrade(result.percentage);

  // Optional fields — only rendered if the API ever provides them.
  const hasBreakdown =
    typeof result.correct_answers === "number" &&
    typeof result.wrong_answers === "number";
  const hasAnswerReview = Array.isArray(result.answer_review);
  const hasTimeTaken = typeof result.time_taken === "number";

  return (
    <LearnerLayout>
      <div className="max-w-3xl mx-auto">
        {/* Result summary */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            RESULT SUMMARY
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Assessment Result
          </h1>

          {/* Score & grade */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                Score
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">
                {result.score}
              </h2>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                Percentage
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent mt-2">
                {result.percentage}%
              </h2>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                Grade
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 flex items-center justify-center gap-2">
                <Award size={28} className="text-amber-400" />
                {grade}
              </h2>
            </div>
          </div>

          {/* Pass/Fail badge + insight */}
          <div className="mt-10">
            {result.passed ? (
              <div>
                <h2 className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-bold text-emerald-400">
                  <CheckCircle2 size={30} />
                  PASSED
                </h2>
                <p className="text-slate-400 mt-3 max-w-md mx-auto">
                  Congratulations! You have successfully completed this
                  assessment.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-bold text-rose-400">
                  <XCircle size={30} />
                  FAILED
                </h2>
                <p className="text-slate-400 mt-3 max-w-md mx-auto">
                  Keep learning and try the assessment again.
                </p>
              </div>
            )}
          </div>

          {/* Performance insights */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400 font-mono max-w-md mx-auto">
            {result.percentage >= 90
              ? "Outstanding performance — you've mastered this material."
              : result.passed
              ? "Solid work. Review the areas you missed to sharpen further."
              : "You're close — revisit the lessons and focus on weaker topics before retrying."}
          </div>

          {/* Time taken — only if the API ever provides it */}
          {hasTimeTaken && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-mono text-slate-300">
              <Clock size={16} className="text-cyan-300" />
              Time taken: {formatDuration(result.time_taken)}
            </div>
          )}

          {/* Correct/Wrong indicators — only if the API ever provides it */}
          {hasBreakdown && (
            <div className="mt-6 flex justify-center gap-6 text-sm font-mono">
              <span className="inline-flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={16} />
                {result.correct_answers} correct
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-300">
                <XCircle size={16} />
                {result.wrong_answers} wrong
              </span>
            </div>
          )}

          {result.passed && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloading}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber-500 text-black px-8 py-3 text-sm font-semibold hover:bg-amber-400 disabled:opacity-60 transition-colors"
            >
              {downloading ? "Preparing Certificate..." : "🎓 Download Certificate"}
            </button>
          )}

          {/* Retry & next actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {!result.passed && (
              <button
                onClick={() =>
                  result.course_id
                    ? navigate(`/assessment/${result.course_id}`)
                    : navigate("/my-courses")
                }
                className="rounded-full border border-rose-400/30 bg-rose-400/10 text-rose-300 px-6 py-3 text-sm font-semibold hover:bg-rose-400/20 transition-colors"
              >
                Retry Assessment
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/my-courses")}
              className="rounded-full border border-white/10 bg-white/[0.05] text-slate-200 px-6 py-3 text-sm font-medium hover:bg-white/[0.09] transition-colors"
            >
              My Courses
            </button>
          </div>
        </div>

        {/* Answer review — only if the API ever provides it */}
        {hasAnswerReview && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 animate-fade-in">
            <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Answer Review
            </h2>

            <div className="space-y-3">
              {result.answer_review.map((item, index) => (
                <div
                  key={item.question_id || index}
                  className={`rounded-xl border p-4 ${
                    item.is_correct
                      ? "border-emerald-400/20 bg-emerald-400/5"
                      : "border-rose-400/20 bg-rose-400/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.is_correct ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                    ) : (
                      <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-slate-200 text-sm">
                        {item.question}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Your answer: {item.selected_option}
                        {!item.is_correct &&
                          item.correct_option &&
                          ` · Correct: ${item.correct_option}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </LearnerLayout>
  );
}

export default Result;