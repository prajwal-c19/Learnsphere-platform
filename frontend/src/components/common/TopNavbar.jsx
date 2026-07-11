import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";

import { getProfile } from "../../services/profileService";

function TopNavbar() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile();

            setUser(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    return (

        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">

            {/* Left */}

            <div>

                <h1 className="text-3xl font-bold text-slate-800">

                    Welcome Back 👋

                </h1>

                <p className="text-slate-500 mt-1">

                    Continue your learning journey.

                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-6">

                <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-2 w-80">

                    <Search
                        size={18}
                        className="text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="bg-transparent outline-none w-full text-sm"
                    />

                </div>

                <button className="p-2 rounded-full hover:bg-slate-100">

                    <Bell size={22} />

                </button>

                {

                    user && (

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

                                {

                                    user.name
                                        .charAt(0)
                                        .toUpperCase()

                                }

                            </div>

                            <div>

                                <h3 className="font-semibold">

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
