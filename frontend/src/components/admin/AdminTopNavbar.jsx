import { ShieldCheck } from "lucide-react";

function AdminTopNavbar() {

    return (

        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">

            <div>

                <h1 className="text-2xl font-bold text-slate-800">

                    Admin Dashboard

                </h1>

                <p className="text-sm text-slate-500">

                    Manage LearnSphere Platform

                </p>

            </div>

            <div className="flex items-center gap-4">

                <div className="flex items-center gap-3 bg-indigo-100 px-4 py-2 rounded-xl">

                    <ShieldCheck
                        size={22}
                        className="text-indigo-600"
                    />

                    <div>

                        <p className="text-sm font-semibold">

                            Administrator

                        </p>

                        <p className="text-xs text-slate-500">

                            Full Access

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default AdminTopNavbar;
