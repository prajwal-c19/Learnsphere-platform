import {

    LayoutDashboard,

    BookOpen,

    GraduationCap,

    FileText,

    Trophy,

    LogOut,

    Shield,

} from "lucide-react";

import {

    NavLink,

    useNavigate,

} from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        const confirmLogout = window.confirm(

            "Are you sure you want to logout?"

        );

        if (!confirmLogout) return;

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

        <aside className="sticky top-0 h-screen w-72 bg-slate-900 text-white flex flex-col shadow-2xl">

            {/* ==========================================
                Logo Section
            ========================================== */}

            <div className="px-8 py-8 border-b border-slate-800">

                <h1 className="text-4xl font-extrabold text-indigo-400 tracking-tight">

                    LearnSphere

                </h1>

                <p className="text-slate-400 text-sm mt-2">

                    Learning Experience Platform

                </p>

            </div>

            {/* ==========================================
                Navigation
            ========================================== */}

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                              {

                    menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink

                                key={item.path}

                                to={item.path}

                                className={({ isActive }) =>

                                    `group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${

                                        isActive

                                            ? "bg-indigo-600 text-white shadow-lg"

                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"

                                    }`

                                }

                            >

                                <div

                                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-indigo-500 transition-all duration-300"

                                >

                                    <Icon size={20} />

                                </div>

                                <span className="font-medium text-base">

                                    {item.name}

                                </span>

                            </NavLink>

                        );

                    })

                }

            </nav>

            {/* ==========================================
                Bottom Actions
            ========================================== */}

            <div className="border-t border-slate-800 p-6 space-y-3">
                              {/* ==========================================
                    Admin Dashboard
                ========================================== */}

                <button

                    onClick={() => navigate("/admin")}

                    className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-indigo-600 rounded-2xl py-3 transition-all duration-300"

                >

                    <Shield size={20} />

                    <span className="font-medium">

                        Admin Dashboard

                    </span>

                </button>

                {/* ==========================================
                    Logout
                ========================================== */}

                <button

                    onClick={handleLogout}

                    className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 rounded-2xl py-3 transition-all duration-300"

                >

                    <LogOut size={20} />

                    <span className="font-medium">

                        Logout

                    </span>

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;