import { useEffect, useState } from "react";

import LearnerLayout from "../../layouts/LearnerLayout";

import StatCard from "../../components/common/StatCard";
import DashboardCourseCard from "../../components/learner/DashboardCourseCard";
import ActivityCard from "../../components/learner/ActivityCard";

import API from "../../api/axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await API.get("/dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm text-emerald-400/80">
            ~/dashboard $ loading...
          </p>
        </div>
      </LearnerLayout>
    );
  }

  if (error || !dashboard) {
    return (
      <LearnerLayout>
        <div className="flex justify-center items-center h-[70vh] text-center px-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-red-400">
            {error || "Unable to load dashboard."}
          </h1>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      {/* Welcome hero */}
      <section className="mb-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-mono text-emerald-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ENROLLED · {dashboard.enrolled_courses} COURSES
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          Welcome back, Learner
        </h1>

        <p className="font-mono text-sm text-slate-400 mt-3">
          ~/dashboard $ overall progress at{" "}
          <span className="text-cyan-300">{dashboard.overall_progress}%</span>
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={dashboard.enrolled_courses}
          icon="📚"
        />

        <StatCard
          title="Completed"
          value={dashboard.completed_courses}
          icon="🏆"
        />

        <StatCard
          title="Overall Progress"
          value={`${dashboard.overall_progress}%`}
          icon="📈"
        />
      </div>

      {/* Continue Learning + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="lg:col-span-2 space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Continue Learning
          </h2>

          {dashboard.enrollments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                No Enrollments Yet
              </h2>
              <p className="text-slate-400 mt-3">
                Enroll in a course to start learning.
              </p>
            </div>
          ) : (
            dashboard.enrollments.map((enrollment) => (
              <DashboardCourseCard key={enrollment.id} enrollment={enrollment} />
            ))
          )}
        </div>

        <div className="space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Recent Activity
          </h2>

          <ActivityCard recentResults={dashboard.recent_results} />
        </div>
      </div>
    </LearnerLayout>
  );
}

export default Dashboard;