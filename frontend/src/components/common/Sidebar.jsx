import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Trophy,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "My Courses",
      path: "/my-courses",
      icon: GraduationCap,
    },
    {
      name: "Assessments",
      path: "/assessments",
      icon: FileText,
    },
    {
      name: "Results",
      path: "/results",
      icon: Trophy,
    },
  ];

  return (
    <aside
      className={`relative h-full min-h-screen flex flex-col justify-between
        bg-black text-white border-r border-white/10
        bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.10),transparent_50%)]
        transition-[width] duration-300 ease-[var(--ease-premium)]
        ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Collapse toggle — desktop only */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex absolute -right-3 top-9 w-6 h-6 rounded-full
          bg-gradient-to-br from-cyan-400 to-violet-600 text-black
          items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.5)]
          hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronsRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronsLeft className="w-3.5 h-3.5" />
        )}
      </button>

      <div>
        {/* Logo section — monogram badge, terminal-style tagline */}
        <div
          className={`flex items-center gap-3 px-4 py-8 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center font-black text-black text-sm tracking-tight shadow-[0_0_18px_rgba(56,189,248,0.35)]">
            LS
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400 bg-clip-text text-transparent truncate">
                LearnSphere
              </h1>
              <p className="font-mono text-[11px] text-emerald-400/80 mt-0.5 truncate">
                ~/learn $ ready
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium
                  transition-all duration-200 ease-[var(--ease-premium)]
                  ${collapsed ? "justify-center px-0" : ""}
                  ${
                    isActive
                      ? "bg-white/[0.06] text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                      : "text-slate-400 border border-transparent hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-400 to-violet-500 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                    )}
                    <Icon
                      size={19}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-cyan-300"
                          : "group-hover:scale-110 group-hover:text-cyan-300"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3
            text-sm font-medium text-slate-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/10
            transition-all duration-200 ease-[var(--ease-premium)]
            ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut size={19} className="shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;