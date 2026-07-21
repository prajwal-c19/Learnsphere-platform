import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Trophy,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

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
    <aside className="w-72 bg-slate-900 text-white flex flex-col justify-between min-h-screen">

      <div>

        <div className="px-8 py-8">
          <h1 className="text-3xl font-bold text-indigo-400">
            LearnSphere
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Learning Experience Platform
          </p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-indigo-600 shadow-lg"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      <div className="p-6">

        <button
          onClick={() => navigate("/admin")}
          className="flex w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-3 mb-3 hover:bg-blue-600 transition"
        >
          Admin Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 hover:bg-red-500 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;