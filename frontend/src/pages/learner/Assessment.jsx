import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flag, Clock } from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";

import {
  getAssessmentByCourse,
  getQuestions,
  submitAssessment,
} from "../../services/assessmentService";

function formatElapsed(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function Assessment() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [flagged, setFlagged] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [loading, error]);

  const loadAssessment = async () => {
    try {
      const assessmentData = await getAssessmentByCourse(courseId);
      setAssessment(assessmentData);

      const questionData = await getQuestions(assessmentData.id);
      setQuestions(questionData);
    } catch (err) {
      console.error(err);
      setError("Assessment is not available for this course.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await submitAssessment(assessment.id, answers);
      navigate(`/result/${assessment.id}`);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail || "Failed to submit assessment."
      );
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/assessment $ loading...
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

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const unansweredCount = questions.length - answeredCount;

  return (
    <LearnerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Assessment header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              QUESTION {currentQuestion + 1} OF {questions.length}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              {assessment.title}
            </h1>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 font-mono text-sm text-slate-200 shrink-0">
            <Clock size={16} className="text-cyan-300" />
            {formatElapsed(elapsed)}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-white/10 rounded-full h-2.5 mb-8">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question card */}
          <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {question.question}
              </h2>

              <button
                type="button"
                onClick={() => toggleFlag(question.id)}
                aria-label="Flag for review"
                className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-mono transition-colors ${
                  flagged.has(question.id)
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30"
                }`}
              >
                <Flag size={14} />
                {flagged.has(question.id) ? "Flagged" : "Flag"}
              </button>
            </div>

            <div className="mt-8 space-y-3">
              {[
                { key: "A", value: question.option_a },
                { key: "B", value: question.option_b },
                { key: "C", value: question.option_c },
                { key: "D", value: question.option_d },
              ].map((option) => {
                const isSelected = answers[question.id] === option.key;

                return (
                  <button
                    key={option.key}
                    onClick={() => selectAnswer(question.id, option.key)}
                    className={`w-full text-left rounded-xl p-4 border transition-all duration-200 ease-[var(--ease-premium)] ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-400/15 to-violet-500/15 border-cyan-400/40 text-white"
                        : "border-white/10 text-slate-300 hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`font-semibold mr-2 ${
                        isSelected ? "text-cyan-300" : "text-slate-500"
                      }`}
                    >
                      {option.key}.
                    </span>
                    {option.value}
                  </button>
                );
              })}
            </div>

            {/* Previous / Next / Submit */}
            <div className="flex justify-between mt-10">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 px-6 py-3 text-sm font-medium hover:bg-white/[0.09] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={submitting}
                  className="rounded-xl bg-emerald-500 text-black px-6 py-3 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Finish Assessment"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 text-black px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* Question palette */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 h-fit lg:sticky lg:top-24">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
              Questions
            </h3>

            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((q, index) => {
                const isCurrent = index === currentQuestion;
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged.has(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`relative w-9 h-9 rounded-lg text-xs font-mono font-semibold flex items-center justify-center border transition-all duration-200 ${
                      isCurrent
                        ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                        : isAnswered
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-xs font-mono text-slate-400">
              <p>
                <span className="text-emerald-300">{answeredCount}</span>{" "}
                answered · <span className="text-amber-300">{flagged.size}</span>{" "}
                flagged
              </p>
              <p>
                <span className="text-slate-300">{unansweredCount}</span>{" "}
                remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <h3 className="text-xl font-bold text-white">
              Submit Assessment?
            </h3>
            <p className="text-slate-400 mt-2 text-sm">
              {unansweredCount > 0
                ? `You have ${unansweredCount} unanswered question${
                    unansweredCount === 1 ? "" : "s"
                  }. You can still go back and finish before submitting.`
                : "All questions are answered. Once submitted, you can't change your answers."}
            </p>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 px-5 py-3 text-sm font-medium hover:bg-white/[0.09] transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-500 text-black px-5 py-3 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </LearnerLayout>
  );
}

export default Assessment;