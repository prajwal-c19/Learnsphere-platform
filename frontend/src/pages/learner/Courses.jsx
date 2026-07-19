import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import LearnerLayout from "../../layouts/LearnerLayout";
import CourseCard from "../../components/learner/CourseCard";
import { getCourses } from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();

        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(courses.map((course) => course.category));
    return ["All", ...unique];
  }, [courses]);

  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses]);

  const visibleCourses = useMemo(() => {
    let result = [...courses];

    if (activeCategory !== "All") {
      result = result.filter((course) => course.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "duration") {
      result.sort((a, b) => (a.duration || "").localeCompare(b.duration || ""));
    } else if (sortBy === "category") {
      result.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    }

    return result;
  }, [courses, activeCategory, searchTerm, sortBy]);

  return (
    <LearnerLayout>
      {/* Hero */}
      <section className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {courses.length} COURSES AVAILABLE
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          Explore Courses
        </h1>
        <p className="font-mono text-sm text-slate-400 mt-3">
          ~/courses $ find --category all --sort title
        </p>
      </section>

      {/* Search + filters + sort */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-cyan-400/40 rounded-xl px-4 py-2.5 w-full lg:max-w-md transition-all duration-200">
            <Search size={18} className="text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400/40 transition-colors"
            >
              <option value="title" className="bg-slate-900">Title (A–Z)</option>
              <option value="duration" className="bg-slate-900">Duration</option>
              <option value="category" className="bg-slate-900">Category</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-mono transition-all duration-200 ${
                activeCategory === category
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/courses $ loading...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Featured */}
          {featuredCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Featured
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in">
                {featuredCourses.map((course) => (
                  <CourseCard key={`featured-${course.id}`} course={course} />
                ))}
              </div>
            </section>
          )}

          {/* All courses */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              All Courses
            </h2>

            {visibleCourses.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">
                <h3 className="text-xl font-bold text-white">
                  No courses found
                </h3>
                <p className="text-slate-400 mt-2">
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in">
                {visibleCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </LearnerLayout>
  );
}

export default Courses;