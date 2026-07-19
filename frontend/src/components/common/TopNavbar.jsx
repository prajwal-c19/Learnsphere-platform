import { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

import { getProfile } from "../../services/profileService";

function TopNavbar() {
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white truncate">
            Welcome Back <span className="text-amber-400">👋</span>
          </h1>
          <p className="font-mono text-[11px] text-emerald-400/80 mt-0.5 hidden sm:block">
            ~/dashboard $ continue learning
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden md:flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-cyan-400/40 focus-within:bg-white/[0.08] rounded-xl px-4 py-2.5 w-56 lg:w-80 transition-all duration-200">
            <Search size={18} className="text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all duration-150"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-fuchsia-500 ring-2 ring-black shadow-[0_0_6px_rgba(217,70,239,0.8)]" />
          </button>

          {user && (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.06] transition-colors duration-150"
                aria-expanded={profileOpen}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 text-black flex items-center justify-center font-bold shadow-[0_0_14px_rgba(34,211,238,0.35)] shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block text-left min-w-0">
                  <h3 className="font-semibold text-sm text-white truncate max-w-[120px]">
                    {user.name}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize truncate">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`hidden sm:block text-slate-500 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] p-3 animate-fade-in origin-top-right">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <p className="px-3 pt-2 text-xs text-emerald-400/80 font-mono capitalize">
                    role: {user.role}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;