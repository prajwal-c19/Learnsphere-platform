function ActivityCard({

    recentResults

}) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <h2 className="text-xl font-bold mb-5">

                Recent Activity

            </h2>

            {

                recentResults.length === 0 ? (

                    <p className="text-slate-500">

                        No recent activity available.

                    </p>

                ) : (

                    <div className="space-y-4">

                        {

                            recentResults.map((result) => (

                                <div
                                    key={result.id}
                                    className="flex items-start gap-3"
                                >

                                    <span
                                        className={`text-xl ${
                                            result.passed
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >

                                        {

                                            result.passed

                                                ? "✔"

                                                : "✖"

                                        }

                                    </span>

                                    <div>

                                        <p className="font-medium">

                                            {

                                                result.passed

                                                    ? "Assessment Passed"

                                                    : "Assessment Attempted"

                                            }

                                        </p>

                                        <p className="text-sm text-slate-500">

                                            Score :

                                            {" "}

                                            {result.percentage}%

                                        </p>

                                    </div>

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
