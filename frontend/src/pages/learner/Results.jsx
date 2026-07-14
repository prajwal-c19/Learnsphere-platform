import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";
import { getResultHistory } from "../../services/resultService";

function Results() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchResults();

    }, []);

    const fetchResults = async () => {

        try {

            const data = await getResultHistory();

            setResults(data);

        }

        catch (error) {

            console.error(error);

            setError(
                "Unable to load assessment history."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const totalAssessments = results.length;

    const passed = results.filter(
        (result) => result.passed
    ).length;

    const failed = totalAssessments - passed;

    const averageScore =
        totalAssessments > 0
            ? (
                  results.reduce(
                      (sum, result) =>
                          sum + result.percentage,
                      0
                  ) / totalAssessments
              ).toFixed(1)
            : 0;

    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center mt-20 text-2xl">

                    Loading Results...

                </div>

            </LearnerLayout>

        );

    }

    if (error) {

        return (

            <LearnerLayout>

                <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                    <h2 className="text-2xl font-bold text-red-500">

                        {error}

                    </h2>

                </div>

            </LearnerLayout>

        );

    }

    return (

        <LearnerLayout>

            <div className="max-w-7xl mx-auto">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-slate-800">

                        Assessment Results

                    </h1>

                    <p className="text-slate-500 mt-2">

                        View your assessment history and performance.

                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Assessments

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {totalAssessments}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Passed

                        </p>

                        <h2 className="text-4xl font-bold text-green-600 mt-2">

                            {passed}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Failed

                        </p>

                        <h2 className="text-4xl font-bold text-red-600 mt-2">

                            {failed}

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <p className="text-slate-500">

                            Average Score

                        </p>

                        <h2 className="text-4xl font-bold text-indigo-600 mt-2">

                            {averageScore}%

                        </h2>

                    </div>

                </div>

                <div className="mt-10 space-y-6">
                                    {

                    results.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">

                            <h2 className="text-2xl font-bold text-slate-700">

                                No Results Found

                            </h2>

                            <p className="text-slate-500 mt-3">

                                Complete an assessment to see your results here.

                            </p>

                        </div>

                    ) : (

                        results.map((result) => (

                            <div
                                key={result.assessment_id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
                            >

                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

                                    <div>

                                        <h2 className="text-2xl font-bold text-slate-800">

                                            {result.course_name}

                                        </h2>

                                        <p className="text-slate-500 mt-2">

                                            Attempted on{" "}

                                            {new Date(
                                                result.submitted_at
                                            ).toLocaleString()}

                                        </p>

                                    </div>

                                    <div className="text-center">

                                        <p className="text-slate-500">

                                            Score

                                        </p>

                                        <h2 className="text-3xl font-bold">

                                            {result.score}

                                        </h2>

                                    </div>

                                    <div className="text-center">

                                        <p className="text-slate-500">

                                            Percentage

                                        </p>

                                        <h2 className="text-3xl font-bold text-indigo-600">

                                            {result.percentage}%

                                        </h2>

                                    </div>

                                    <div className="text-center">

                                        {

                                            result.passed ? (

                                                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                                                    ✅ PASS

                                                </span>

                                            ) : (

                                                <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">

                                                    ❌ FAIL

                                                </span>

                                            )

                                        }

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/result/${result.assessment_id}`
                                            )
                                        }
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                                    >

                                        View Details

                                    </button>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </div>

        </LearnerLayout>

    );

}

export default Results;