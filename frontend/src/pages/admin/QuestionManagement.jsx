import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Plus
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

import QuestionForm from "../../components/admin/QuestionForm";
import QuestionTable from "../../components/admin/QuestionTable";

import {

    getAssessment,

    getQuestions,

    createQuestion,

    deleteQuestion

} from "../../services/assessmentService";

function QuestionManagement() {

    const navigate = useNavigate();

    const { assessmentId } = useParams();

    const [assessment, setAssessment] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const assessmentResponse =
                await getAssessment(
                    assessmentId
                );

            const questionResponse =
                await getQuestions(
                    assessmentId
                );

            setAssessment(
                assessmentResponse
            );

            setQuestions(
                questionResponse
            );

        }

        catch (error) {

            console.error(error);

            alert(
                "Failed to load questions."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleCreateQuestion = async (
        questionData
    ) => {

        try {

            await createQuestion(
                questionData
            );

            setOpenForm(false);

            loadData();

        }

        catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.detail ||

                "Unable to create question."

            );

        }

    };

    const handleDeleteQuestion = async (
        questionId
    ) => {

        const confirmDelete =
            window.confirm(

                "Delete this question?"

            );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteQuestion(
                questionId
            );

            loadData();

        }

        catch (error) {

            console.error(error);

            alert(
                "Failed to delete question."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="flex items-center justify-between mb-8">

                <div>

                    <button

                        onClick={() =>

                            navigate(
                                "/admin/assessments"
                            )

                        }

                        className="flex items-center gap-2 text-indigo-600 mb-4 hover:underline"

                    >

                        <ArrowLeft size={18} />

                        Back to Assessments

                    </button>

                    <h1 className="text-4xl font-bold">

                        Question Management

                    </h1>

                    <p className="text-slate-500 mt-2">

                        {

                            assessment

                                ?

                                assessment.title

                                :

                                "Loading..."

                        }

                    </p>

                </div>

                <button

                    onClick={() =>

                        setOpenForm(true)

                    }

                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"

                >

                    <Plus size={20} />

                    Add Question

                </button>

            </div>

                        {

                loading

                    ? (

                        <div className="flex justify-center items-center h-96">

                            <p className="text-2xl font-semibold">

                                Loading Questions...

                            </p>

                        </div>

                    )

                    : (

                        <>

                            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

                                <div className="grid grid-cols-3 gap-6">

                                    <div>

                                        <p className="text-slate-500">

                                            Assessment

                                        </p>

                                        <h2 className="text-xl font-bold mt-2">

                                            {assessment.title}

                                        </h2>

                                    </div>

                                    <div>

                                        <p className="text-slate-500">

                                            Total Questions Allowed

                                        </p>

                                        <h2 className="text-xl font-bold mt-2">

                                            {assessment.total_questions}

                                        </h2>

                                    </div>

                                    <div>

                                        <p className="text-slate-500">

                                            Current Questions

                                        </p>

                                        <h2 className="text-xl font-bold mt-2">

                                            {questions.length}

                                        </h2>

                                    </div>

                                </div>

                            </div>

                            <QuestionTable

                                questions={questions}

                                onDelete={handleDeleteQuestion}

                            />

                        </>

                    )

            }

            <QuestionForm

                open={openForm}

                assessmentId={assessmentId}

                onClose={() =>

                    setOpenForm(false)

                }

                onSubmit={handleCreateQuestion}

            />
                    </AdminLayout>

    );

}

export default QuestionManagement;
