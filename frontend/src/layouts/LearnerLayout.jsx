import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../components/common/Sidebar";
import TopNavbar from "../components/common/TopNavbar";

function LearnerLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full lg:flex bg-gradient-to-br from-black via-slate-950 to-indigo-950 overflow-hidden">
      {/* Ambient background glows — dark canvas, inspired by the portfolio's
          orbiting neon accents. Purely decorative, sits behind everything. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[26rem] h-[26rem] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Desktop / large tablet: sidebar sits inline in the flex row, always visible. */}
      <div className="relative z-10 hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Tablet & mobile: sidebar becomes a slide-in drawer, closed by default
          so nothing overlaps the content and there's no horizontal scroll. */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] transform transition-transform duration-300 ease-[var(--ease-premium)] ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
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
        {/* Mobile/tablet menu toggle — lives here, not inside TopNavbar itself. */}
        <div className="lg:hidden flex items-center px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <TopNavbar />
        </div>

        <main className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LearnerLayout;