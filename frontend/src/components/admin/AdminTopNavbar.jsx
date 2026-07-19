import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Users,
  BookOpen,
  ClipboardList,
} from "lucide-react";

function useBreadcrumb(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { path, label };
  });
}

function AdminTopNavbar() {
  const location = useLocation();
  const crumbs = useBreadcrumb(location.pathname);
  const pageTitle = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : "Dashboard";

  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quickActions = [
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Courses", path: "/admin/courses", icon: BookOpen },
    { label: "Assessments", path: "/admin/assessments", icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: breadcrumb + page title */}
          <div className="min-w-0">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-1 overflow-x-auto whitespace-nowrap">
              <Link to="/admin" className="hover:text-amber-300 transition-colors">
                Admin
              </Link>
              {crumbs.slice(1).map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-slate-600" />
                  <Link
                    to={crumb.path}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>

            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right: search, quick actions, theme, notifications, profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global search */}
            <div className="hidden md:flex items-center gap-2.5 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-xl px-3.5 py-2 w-48 lg:w-64 transition-all duration-200">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search admin..."
                className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* Quick actions */}
            <div className="hidden lg:flex items-center gap-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    title={action.label}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-colors"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle (visual only — no ThemeProvider wired up yet) */}
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-colors"
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2.5 rounded-full text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-950" />
            </button>

            {/* Mobile "more" — reveals search + quick actions on small screens */}
            <button
              type="button"
              onClick={() => setMobileMoreOpen((prev) => !prev)}
              aria-label="More options"
              className="md:hidden p-2.5 rounded-full text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Profile dropdown */}
            <div className="relative pl-1" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-br from-amber-400/10 to-orange-500/10 px-3 py-1.5 hover:border-amber-400/30 transition-colors"
              >
                <ShieldCheck size={18} className="text-amber-300" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-white leading-none">
                    Administrator
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Full Access
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden sm:block text-slate-500 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 animate-fade-in origin-top-right">
                  <p className="text-sm font-semibold text-white px-2 py-1">
                    Administrator
                  </p>
                  <p className="text-xs text-slate-500 px-2 font-mono">
                    Manage LearnSphere Platform
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile overflow panel: search + quick actions */}
        {mobileMoreOpen && (
          <div className="md:hidden mt-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2.5 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-xl px-3.5 py-2.5 transition-all duration-200">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search admin..."
                className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                  >
                    <Icon size={16} />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminTopNavbar;