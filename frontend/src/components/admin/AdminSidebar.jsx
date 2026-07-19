import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Assessments",
      path: "/admin/assessments",
      icon: ClipboardList,
    },
  ];

  return (
    <aside
      className={`relative h-full min-h-screen flex flex-col justify-between
        bg-slate-950 text-white border-r border-white/10
        bg-[radial-gradient(circle_at_15%_0%,rgba(251,191,36,0.06),transparent_45%)]
        transition-[width] duration-300 ease-[var(--ease-premium)]
        ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Collapse toggle — desktop only */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex absolute -right-3 top-9 w-6 h-6 rounded-full
          bg-gradient-to-br from-amber-400 to-orange-600 text-black
          items-center justify-center shadow-[0_0_14px_rgba(251,191,36,0.4)]
          hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronsRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronsLeft className="w-3.5 h-3.5" />
        )}
      </button>

      <div>
        {/* Logo section */}
        <div
          className={`flex items-center gap-3 px-4 py-8 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.3)]">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent truncate">
                LearnSphere
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 truncate">
                Admin Panel
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
                end={item.path === "/admin"}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium
                  transition-all duration-200 ease-[var(--ease-premium)]
                  ${collapsed ? "justify-center px-0" : ""}
                  ${
                    isActive
                      ? "bg-white/[0.06] text-white border border-amber-400/30 shadow-[0_0_18px_rgba(251,191,36,0.1)]"
                      : "text-slate-400 border border-transparent hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    )}
                    <Icon
                      size={19}
                      className={`shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-amber-300"
                          : "group-hover:scale-110 group-hover:text-amber-300"
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

      <div>
        {/* User profile */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-t border-white/10 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-black flex items-center justify-center text-xs font-bold">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Administrator
              </p>
              <p className="text-xs text-slate-500 truncate">Full Access</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4">
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
      </div>
    </aside>
  );
}

export default AdminSidebar;