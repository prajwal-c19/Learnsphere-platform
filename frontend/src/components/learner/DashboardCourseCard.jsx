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
        bg-white dark:bg-slate-900
        border border-slate-100 dark:border-white/10
        shadow-[0_2px_10px_rgba(15,23,42,0.08)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_-12px_rgba(79,70,229,0.4)]
      "
    >
      {/* Thumbnail / banner */}
      <div className="relative h-44 w-full overflow-hidden">
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
              bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500
            "
          >
            <Sparkles className="h-10 w-10 text-white/80" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

        {course.category && (
          <span
            className="
              absolute top-3 left-3
              rounded-full px-3 py-1 text-xs font-semibold
              bg-white text-indigo-700
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
            by{" "}
            <span className="font-medium text-indigo-600">
              {course.instructor}
            </span>
          </p>
        )}

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              {course.duration}
            </span>
          )}

          {course.duration && course.format && (
            <span className="text-slate-300 dark:text-slate-600">|</span>
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
            bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600
            shadow-[0_10px_24px_-8px_rgba(99,102,241,0.65)]
            transition-all duration-300 ease-out
            hover:shadow-[0_14px_30px_-8px_rgba(99,102,241,0.8)]
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