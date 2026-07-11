import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";
import API from "../../api/axios";

import { downloadCertificate } from "../../services/certificateService";

function Result() {

    const { assessmentId } = useParams();

    const navigate = useNavigate();

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [downloading, setDownloading] = useState(false);

    useEffect(() => {

        fetchResult();

    }, []);

    const fetchResult = async () => {

        try {

            const response = await API.get(
                `/results/assessment/${assessmentId}`
            );

            setResult(response.data);

        }

        catch (error) {

            console.error(error);

            setError("Unable to load assessment result.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDownloadCertificate = async () => {

        try {

            setDownloading(true);

            await downloadCertificate(assessmentId);

        }

        catch (error) {

            console.error(error);

            alert("Failed to download certificate.");

        }

        finally {

            setDownloading(false);

        }

    };

    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center text-2xl mt-20">

                    Loading Result...

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

            <div className="max-w-3xl mx-auto">

                <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

                    <h1 className="text-4xl font-bold text-indigo-700">

                        Assessment Result

                    </h1>

                    <div className="mt-10 space-y-6">

                        <div>

                            <p className="text-slate-500">

                                Score

                            </p>

                            <h2 className="text-5xl font-bold">

                                {result.score}

                            </h2>

                        </div>

                        <div>

                            <p className="text-slate-500">

                                Percentage

                            </p>

                            <h2 className="text-5xl font-bold">

                                {result.percentage}%

                            </h2>

                        </div>

                        <div>

                            {

                                result.passed ? (

                                    <div>

                                        <h2 className="text-4xl font-bold text-green-600">

                                            ✅ PASSED

                                        </h2>

                                        <p className="text-slate-500 mt-2">

                                            Congratulations! You have successfully completed this assessment.

                                        </p>

                                    </div>

                                ) : (

                                    <div>

                                        <h2 className="text-4xl font-bold text-red-600">

                                            ❌ FAILED

                                        </h2>

                                        <p className="text-slate-500 mt-2">

                                            Keep learning and try the assessment again.

                                        </p>

                                    </div>

                                )

                            }

                        </div>

                        {

                            result.passed && (

                                <button
                                    onClick={handleDownloadCertificate}
                                    disabled={downloading}
                                    className="bg-amber-500 text-white px-8 py-3 rounded-xl hover:bg-amber-600 disabled:opacity-60"
                                >

                                    {

                                        downloading

                                            ? "Preparing Certificate..."

                                            : "🎓 Download Certificate"

                                    }

                                </button>

                            )

                        }

                    </div>

                    <div className="flex justify-center gap-6 mt-12">

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700"
                        >

                            Dashboard

                        </button>

                        <button
                            onClick={() => navigate("/my-courses")}
                            className="bg-slate-700 text-white px-8 py-3 rounded-xl hover:bg-slate-800"
                        >

                            My Courses

                        </button>

                    </div>

                </div>

            </div>

        </LearnerLayout>

    );

}

export default Result;
