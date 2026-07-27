import { useEffect, useState } from "react";

import {

    Bell,

    Search,

} from "lucide-react";

import {

    useNavigate,

} from "react-router-dom";

import { getProfile } from "../../services/profileService";

import { getCourses } from "../../services/courseService";

function TopNavbar() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [courses, setCourses] = useState([]);

    const [search, setSearch] = useState("");

    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        if (search.trim() === "") {

            setFilteredCourses([]);

            return;

        }

        const results = courses.filter((course) =>

            course.title

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            course.category

                ?.toLowerCase()

                .includes(search.toLowerCase())

        );

        setFilteredCourses(results);

    }, [search, courses]);

    const loadData = async () => {

        try {

            const profile = await getProfile();

            setUser(profile);

            const allCourses = await getCourses();

            setCourses(allCourses);

        }

        catch (error) {

            console.error(error);

        }

    };

    return (

        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between relative">
                        {/* ==========================================
                Left Section
            ========================================== */}

            <div>

                <h1 className="text-3xl font-bold text-slate-800">

                    Welcome Back 👋

                </h1>

                <p className="text-slate-500 mt-1">

                    Continue your learning journey.

                </p>

            </div>

            {/* ==========================================
                Right Section
            ========================================== */}

            <div className="flex items-center gap-6">

                {/* ==========================================
                    Search Box
                ========================================== */}

                <div className="relative w-96">

                    <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3">

                        <Search

                            size={18}

                            className="text-slate-500"

                        />

                        <input

                            type="text"

                            placeholder="Search courses..."

                            value={search}

                            onChange={(e) =>

                                setSearch(e.target.value)

                            }

                            className="bg-transparent outline-none w-full text-sm"

                        />

                    </div>

                    {/* ==========================================
                        Search Results
                    ========================================== */}

                    {

                        search.trim() !== "" && (

                            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">

                                {

                                    filteredCourses.length > 0 ? (

                                        filteredCourses

                                            .slice(0, 6)

                                            .map((course) => (

                                                <button

                                                    key={course.id}

                                                    onClick={() => {

                                                        navigate(`/courses/${course.id}`);

                                                        setSearch("");

                                                    }}

                                                    className="w-full text-left px-5 py-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0"

                                                >

                                                    <h3 className="font-semibold text-slate-800">

                                                        {course.title}

                                                    </h3>

                                                    <p className="text-sm text-slate-500 mt-1">

                                                        {course.category}

                                                    </p>

                                                </button>

                                            ))

                                    ) : (

                                        <div className="p-6 text-center">

                                            <Search

                                                size={32}

                                                className="mx-auto text-slate-300"

                                            />

                                            <h3 className="mt-3 font-semibold text-slate-700">

                                                No courses found

                                            </h3>

                                            <p className="text-sm text-slate-500 mt-2">

                                                Try another course title or tag.

                                            </p>

                                        </div>

                                    )

                                }

                            </div>

                        )

                    }

                </div>
                                {/* ==========================================
                    Notification
                ========================================== */}

                <button

                    className="relative p-3 rounded-full hover:bg-slate-100 transition"

                >

                    <Bell

                        size={22}

                        className="text-slate-700"

                    />

                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500"></span>

                </button>

                {/* ==========================================
                    User Profile
                ========================================== */}

                {

                    user && (

                        <div

                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300"

                        >

                            <div

                                className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center text-lg font-bold"

                            >

                                {

                                    user.name

                                        ?.charAt(0)

                                        .toUpperCase()

                                }

                            </div>

                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    {user.name}

                                </h3>

                                <p className="text-xs text-slate-500 capitalize">

                                    {user.role}

                                </p>

                            </div>

                        </div>

                    )

                }

            </div>
                    </header>

    );

}

export default TopNavbar;