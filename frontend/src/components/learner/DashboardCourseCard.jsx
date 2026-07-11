import { useNavigate } from "react-router-dom";

function DashboardCourseCard({

    enrollment

}) {

    const navigate = useNavigate();

    const handleContinue = () => {

        navigate(
            `/course/${enrollment.course.id}/lessons`
        );

    };

    return (

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">

                        {enrollment.course.title}

                    </h2>

                    <p className="text-slate-500 mt-2">

                        {enrollment.course.category}

                    </p>

                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollment.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >

                    {enrollment.status}

                </span>

            </div>

            <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">

                    <span>

                        Progress

                    </span>

                    <span>

                        {enrollment.progress}%

                    </span>

                </div>

                <div className="w-full bg-slate-200 rounded-full h-3">

                    <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{
                            width: `${enrollment.progress}%`
                        }}
                    />

                </div>

            </div>

            <div className="flex justify-between items-center mt-6">

                <div className="text-sm text-slate-500">

                    {enrollment.course.format}

                </div>

                <button
                    onClick={handleContinue}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                >

                    Continue Learning

                </button>

            </div>

        </div>

    );

}

export default DashboardCourseCard;
