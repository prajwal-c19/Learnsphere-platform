import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, ChevronDown, ChevronRight } from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopNavbar from "../components/admin/AdminTopNavbar";

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

function AdminLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const crumbs = useBreadcrumb(location.pathname);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full lg:flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient amber/gold glow — distinct admin identity, separate from the
          learner side's cyan/violet palette. */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 right-0 w-[30rem] h-[30rem] rounded-full bg-amber-500/[0.06] blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[24rem] h-[24rem] rounded-full bg-orange-600/[0.05] blur-[130px]" />
      </div>

      {/* Desktop / large tablet: sidebar sits inline, always visible. */}
      <div className="relative z-10 hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Tablet & mobile: sidebar becomes a slide-in drawer. */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] transform transition-transform duration-300 ease-[var(--ease-premium)] ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-fade-in"
        />
      )}

      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        {/* Existing top navbar — untouched, wrapped for sticky + mobile toggle */}
        <div className="sticky top-0 z-20">
          <div className="lg:hidden flex items-center px-4 py-2.5 bg-slate-900/90 backdrop-blur-xl border-b border-white/5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-colors"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>

          <AdminTopNavbar />

          {/* Utility bar: breadcrumb + notifications + profile — new strip,
              since these can't be added inside AdminTopNavbar itself. */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 overflow-x-auto whitespace-nowrap">
              <Link to="/admin" className="hover:text-amber-300 transition-colors">
                Admin
              </Link>
              {crumbs.slice(1).map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-slate-600" />
                  {i === crumbs.length - 2 ? (
                    <span className="text-amber-300">{crumb.label}</span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="hover:text-amber-300 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                aria-label="Notifications"
                className="relative p-2 rounded-full text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-black flex items-center justify-center text-xs font-bold shrink-0">
                    A
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
                      Full Access
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content with a subtle transition on route change */}
        <main className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div
            key={location.pathname}
            className="w-full max-w-[1440px] mx-auto space-y-8 animate-fade-in"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;