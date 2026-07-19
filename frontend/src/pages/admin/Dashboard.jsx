import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Users,
  UserCheck,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Award,
  Plus,
  UserPlus,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getDashboard } from "../../services/adminService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center gap-3 h-[70vh]">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin $ loading dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-xl font-semibold text-red-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: dashboard.total_users,
      icon: Users,
      accent: "text-blue-300",
      badge: "bg-blue-400/10 border-blue-400/25",
    },
    {
      title: "Learners",
      value: dashboard.total_learners,
      icon: UserCheck,
      accent: "text-emerald-300",
      badge: "bg-emerald-400/10 border-emerald-400/25",
    },
    {
      title: "Admins",
      value: dashboard.total_admins,
      icon: ShieldCheck,
      accent: "text-fuchsia-300",
      badge: "bg-fuchsia-400/10 border-fuchsia-400/25",
    },
    {
      title: "Courses",
      value: dashboard.total_courses,
      icon: BookOpen,
      accent: "text-orange-300",
      badge: "bg-orange-400/10 border-orange-400/25",
    },
    {
      title: "Assessments",
      value: dashboard.total_assessments,
      icon: ClipboardList,
      accent: "text-pink-300",
      badge: "bg-pink-400/10 border-pink-400/25",
    },
    {
      title: "Questions",
      value: dashboard.total_questions,
      icon: HelpCircle,
      accent: "text-sky-300",
      badge: "bg-sky-400/10 border-sky-400/25",
    },
    {
      title: "Quiz Attempts",
      value: dashboard.quiz_attempts,
      icon: BarChart3,
      accent: "text-violet-300",
      badge: "bg-violet-400/10 border-violet-400/25",
    },
    {
      title: "Pass Rate",
      value: `${dashboard.pass_rate}%`,
      icon: Award,
      accent: "text-amber-300",
      badge: "bg-amber-400/10 border-amber-400/25",
    },
  ];

  const quickActions = [
    { label: "Add Course", to: "/admin/courses", icon: Plus },
    { label: "Manage Users", to: "/admin/users", icon: UserPlus },
    { label: "Assessments", to: "/admin/assessments", icon: ClipboardList },
  ];

  const hasRecentUsers = Array.isArray(dashboard.recent_users);
  const hasRecentCourses = Array.isArray(dashboard.recent_courses);
  const hasRecentActivity = Array.isArray(dashboard.recent_activity);

  return (
    <AdminLayout>
      {/* Hero / welcome banner */}
      <section className="mb-8 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono text-amber-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          PLATFORM STATUS: LIVE
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
          Platform Overview
        </h1>
        <p className="text-slate-400 mt-3 max-w-xl">
          Welcome to the LearnSphere Administration Panel — monitor users,
          courses, and assessment performance at a glance.
        </p>
      </section>

      {/* Premium StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 ease-[var(--ease-premium)] hover:border-amber-400/25 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm">{card.title}</p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`p-3 rounded-xl border ${card.badge} ${card.accent} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics overview + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {/* Average score — radial chart via conic-gradient, no chart library */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-6">
            Average Quiz Score
          </h2>

          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#fbbf24 ${dashboard.average_score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="absolute inset-2.5 rounded-full bg-slate-950 flex items-center justify-center">
              <span className="text-3xl font-extrabold text-amber-300">
                {dashboard.average_score}%
              </span>
            </div>
          </div>
        </div>

        {/* Platform summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-6">
            Platform Summary
          </h2>

          <div className="space-y-3.5 text-sm">
            {[
              ["Total Users", dashboard.total_users],
              ["Total Courses", dashboard.total_courses],
              ["Assessments", dashboard.total_assessments],
              ["Quiz Attempts", dashboard.quiz_attempts],
              ["Pass Rate", `${dashboard.pass_rate}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-slate-400">{label}</span>
                <strong className="text-white font-semibold">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-200 hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-amber-200 transition-colors"
                >
                  <Icon size={18} className="text-amber-300" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity / users / courses — only if the API provides them */}
      {(hasRecentActivity || hasRecentUsers || hasRecentCourses) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-8">
          {hasRecentUsers && (
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
              <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Recent Users
              </h2>
              <div className="space-y-2">
                {dashboard.recent_users.map((user, i) => (
                  <div
                    key={user.id || i}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm text-slate-200 truncate">
                      {user.name || user.email}
                    </span>
                    {user.role && (
                      <span className="text-xs font-mono text-slate-500 capitalize">
                        {user.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasRecentCourses && (
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
              <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Recent Courses
              </h2>
              <div className="space-y-2">
                {dashboard.recent_courses.map((course, i) => (
                  <div
                    key={course.id || i}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm text-slate-200 truncate">
                      {course.title}
                    </span>
                    {course.category && (
                      <span className="text-xs font-mono text-slate-500">
                        #{course.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasRecentActivity && (
            <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
              <h2 className="flex items-center gap-2 text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Recent Activity
              </h2>
              <div className="space-y-2">
                {dashboard.recent_activity.map((activity, i) => (
                  <div
                    key={activity.id || i}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm text-slate-300">
                      {activity.description || activity.message}
                    </span>
                    {activity.timestamp && (
                      <span className="text-xs font-mono text-slate-500 shrink-0 ml-3">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default Dashboard;