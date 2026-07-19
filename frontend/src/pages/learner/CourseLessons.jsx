import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CheckCircle2,
  Circle,
  FileText,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";

import { getLessonsByCourse, completeLesson } from "../../services/lessonService";
import { getCourse } from "../../services/courseService";

function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com.*(?:\?v=|\/embed\/|\/v\/))([^\s&?/]+)/
  );

  const videoId = match ? match[1] : null;

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function CourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    loadLessons();
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const data = await getCourse(courseId);
      setCourse(data);
    } catch (error) {
      // Header still works fine without course metadata.
      console.error(error);
    }
  };

  const loadLessons = async () => {
    try {
      const data = await getLessonsByCourse(courseId);
      setLessons(data);

      const firstIncomplete = data.find((lesson) => !lesson.completed) || data[0];
      setActiveLesson(firstIncomplete || null);
    } catch (error) {
      console.error(error);
      alert("Failed to load lessons for this course.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      setMarking(true);
      await completeLesson(lessonId);
      await loadLessons();
    } catch (error) {
      console.error(error);
      alert("Failed to update lesson progress.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/lessons $ loading...
          </p>
        </div>
      </LearnerLayout>
    );
  }

  if (lessons.length === 0) {
    return (
      <LearnerLayout>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            No lessons available for this course yet.
          </h2>
          <button
            onClick={() => navigate(`/assessment/${courseId}`)}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black text-sm font-semibold px-6 py-3 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Go to Assessment
          </button>
        </div>
      </LearnerLayout>
    );
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const assessmentUnlocked = progress >= 80;

  const activeIndex = lessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < lessons.length - 1
      ? lessons[activeIndex + 1]
      : null;

  return (
    <LearnerLayout>
      {/* Course header */}
      <section className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {completedCount} / {lessons.length} LESSONS COMPLETE
        </span>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          {course?.title || "Course Lessons"}
        </h1>

        {course?.category && (
          <p className="font-mono text-sm text-slate-400 mt-3">
            #{course.category} · {course.format}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson playlist sidebar */}
        <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-white mb-1">Lessons</h2>
          <p className="text-sm text-slate-400 mb-4">
            {completedCount} of {lessons.length} completed ({progress}%)
          </p>

          <div className="w-full bg-white/10 rounded-full h-2 mb-5">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {lessons.map((lesson) => {
              const isActive = activeLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all duration-200 ease-[var(--ease-premium)] ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-400/15 to-violet-500/15 border border-cyan-400/30 text-white"
                      : "border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle2
                      size={18}
                      className={isActive ? "text-cyan-300" : "text-emerald-400"}
                    />
                  ) : (
                    <Circle size={18} className="text-slate-500" />
                  )}
                  <span className="text-sm truncate">
                    {lesson.order}. {lesson.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            {assessmentUnlocked ? (
              <button
                onClick={() => navigate(`/assessment/${courseId}`)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 text-black text-sm font-semibold px-5 py-3 hover:bg-emerald-400 transition-colors"
              >
                📝 Take Assessment
              </button>
            ) : (
              <div className="text-center text-sm text-amber-400/80 font-mono flex items-center justify-center gap-2">
                <Lock size={16} />
                Assessment unlocks at 80% progress
              </div>
            )}
          </div>
        </div>

        {/* Active lesson content */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8">
          {activeLesson ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {activeLesson.title}
              </h1>
              <p className="text-slate-400 mt-2">{activeLesson.description}</p>

              {activeLesson.video_url && (
                <div className="mt-6 aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <iframe
                    className="w-full h-full"
                    src={getYoutubeEmbedUrl(activeLesson.video_url)}
                    title={activeLesson.title}
                    allowFullScreen
                  />
                </div>
              )}

              {/* Notes / resources */}
              {activeLesson.notes_url && (
                <a
                  href={activeLesson.notes_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-slate-200 hover:bg-white/[0.09] transition-colors"
                >
                  <FileText size={18} />
                  Download Notes
                </a>
              )}

              {/* Mark as complete */}
              <div className="mt-10">
                {activeLesson.completed ? (
                  <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 size={20} />
                    Lesson Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(activeLesson.id)}
                    disabled={marking}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 text-black text-sm font-semibold px-6 py-3 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {marking ? "Updating..." : "Mark as Complete"}
                  </button>
                )}
              </div>

              {/* Previous / Next navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <button
                  onClick={() => nextLesson && setActiveLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-400">Select a lesson to begin.</p>
          )}
        </div>
      </div>
    </LearnerLayout>
  );
}

export default CourseLessons;