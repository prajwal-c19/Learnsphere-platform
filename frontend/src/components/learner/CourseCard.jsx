import { useState } from "react";
import { Clock, Layers, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { enrollCourse } from "../../services/enrollmentService";
import ProgressBar from "../common/ProgressBar";

function CourseCard({ course }) {
  const [loading, setLoading] = useState(false);

  const hasProgress = typeof course.progress === "number";

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const response = await enrollCourse(course.id);

      alert(response.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        bg-white/65 dark:bg-slate-900/50
        backdrop-blur-xl
        border border-white/25 dark:border-white/10
        shadow-[0_1px_2px_rgba(15,23,42,0.06)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-[0_16px_40px_-12px_rgba(79,70,229,0.35)]
        hover:border-indigo-400/40
      "
    >
      {/* Thumbnail / banner */}
      <div className="relative h-40 w-full overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="
              h-full w-full object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex h-full w-full items-center justify-center
              bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500
            "
          >
            <Sparkles className="h-10 w-10 text-white/80" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0" />

        {course.category && (
          <span
            className="
              absolute top-3 left-3
              rounded-full px-3 py-1 text-xs font-semibold
              bg-white/80 text-indigo-700
              backdrop-blur-md
              border border-white/40
              shadow-sm
            "
          >
            {course.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
          {course.title}
        </h2>

        {course.instructor && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            by {course.instructor}
          </p>
        )}

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              {course.duration}
            </span>
          )}

          {course.format && (
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              {course.format}
            </span>
          )}
        </div>

        {hasProgress && (
          <div className="mt-5">
            <ProgressBar progress={course.progress} />
          </div>
        )}

        <button
          onClick={handleEnroll}
          disabled={loading}
          className="
            group/btn mt-6 flex w-full items-center justify-center gap-2
            rounded-xl px-5 py-3 text-sm font-semibold text-white
            bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
            shadow-[0_8px_20px_-6px_rgba(79,70,229,0.55)]
            transition-all duration-300 ease-out
            hover:shadow-[0_10px_26px_-6px_rgba(79,70,229,0.7)]
            hover:brightness-110
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100
          "
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enrolling...
            </>
          ) : hasProgress ? (
            <>
              Continue Learning
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </>
          ) : (
            <>
              Enroll Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;