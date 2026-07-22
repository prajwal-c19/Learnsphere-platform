import {

    CheckCircle,

    XCircle,

    Trophy,

} from "lucide-react";

function ActivityCard({

    recentResults

}) {

    return (

        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">

                    Recent Activity

                </h2>

                <Trophy

                    size={26}

                    className="text-yellow-500"

                />

            </div>

            {

                recentResults.length === 0

                    ? (

                        <div className="text-center py-10">

                            <Trophy

                                size={50}

                                className="mx-auto text-slate-300 mb-4"

                            />

                            <p className="text-slate-500">

                                No recent activity yet.

                            </p>

                        </div>

                    )

                    : (

                        <div className="space-y-5">

                            {

                                recentResults.map((result) => (

                                    <div

                                        key={result.id}

                                        className="flex items-start gap-4 bg-slate-50 rounded-2xl p-4 hover:bg-indigo-50 transition"

                                    >

                                        {

                                            result.passed

                                                ? (

                                                    <CheckCircle

                                                        size={24}

                                                        className="text-green-600 mt-1"

                                                    />

                                                )

                                                : (

                                                    <XCircle

                                                        size={24}

                                                        className="text-red-500 mt-1"

                                                    />

                                                )

                                        }

                                        <div className="flex-1">

                                            <h3 className="font-semibold text-slate-800">

                                                {

                                                    result.passed

                                                        ? "Assessment Passed"

                                                        : "Assessment Attempted"

                                                }

                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">

                                                Score

                                                {" "}

                                                <span className="font-semibold">

                                                    {result.percentage}%

                                                </span>

                                            </p>

                                        </div>

                                        <span

                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${

                                                result.passed

                                                    ? "bg-green-100 text-green-700"

                                                    : "bg-red-100 text-red-700"

                                            }`}

                                        >

                                            {

                                                result.passed

                                                    ? "Passed"

                                                    : "Failed"

                                            }

                                        </span>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

}

export default ActivityCard;