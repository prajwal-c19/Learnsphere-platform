import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LearnerLayout from "../../layouts/LearnerLayout";

import {
    getAssessmentByCourse,
    getQuestions,
    submitAssessment,
} from "../../services/assessmentService";

function Assessment() {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [assessment, setAssessment] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        loadAssessment();

    }, []);

    const loadAssessment = async () => {

        try {

            const assessmentData =
                await getAssessmentByCourse(courseId);

            setAssessment(assessmentData);

            const questionData =
                await getQuestions(assessmentData.id);

            setQuestions(questionData);

        }

        catch (err) {

            console.error(err);

            setError(
                "Assessment is not available for this course."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const selectAnswer = (
        questionId,
        option
    ) => {

        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));

    };

    const handleSubmit = async () => {

        if (Object.keys(answers).length !== questions.length) {

            alert(
                "Please answer all questions before submitting."
            );

            return;

        }

        try {

            setSubmitting(true);

            await submitAssessment(
                assessment.id,
                answers
            );

            navigate(
                `/result/${assessment.id}`
            );

        }

        catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.detail ||
                "Failed to submit assessment."
            );

        }

        finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (

            <LearnerLayout>

                <div className="text-center mt-20 text-xl">

                    Loading Assessment...

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

    const question = questions[currentQuestion];

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    return (

        <LearnerLayout>

            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold">

                    {assessment.title}

                </h1>

                <p className="text-slate-500 mt-2">

                    Question {currentQuestion + 1} of {questions.length}

                </p>

                <div className="w-full bg-slate-200 rounded-full h-3 mt-5">

                    <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

                    <h2 className="text-2xl font-semibold">

                        {question.question}

                    </h2>

                    <div className="mt-8 space-y-4">

                        {[
                            { key: "A", value: question.option_a },
                            { key: "B", value: question.option_b },
                            { key: "C", value: question.option_c },
                            { key: "D", value: question.option_d },
                        ].map((option) => (

                            <button
                                key={option.key}
                                onClick={() =>
                                    selectAnswer(
                                        question.id,
                                        option.key
                                    )
                                }
                                className={`w-full text-left border rounded-xl p-4 transition ${
                                    answers[question.id] === option.key
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "hover:bg-indigo-50"
                                }`}
                            >

                                {option.key}. {option.value}

                            </button>

                        ))}

                    </div>

                    <div className="flex justify-between mt-10">

                        <button
                            disabled={currentQuestion === 0}
                            onClick={() =>
                                setCurrentQuestion(
                                    currentQuestion - 1
                                )
                            }
                            className="bg-slate-300 px-6 py-3 rounded-xl disabled:opacity-50"
                        >

                            Previous

                        </button>

                        {

                            currentQuestion ===
                            questions.length - 1 ? (

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
                                >

                                    {

                                        submitting

                                            ? "Submitting..."

                                            : "Finish Assessment"

                                    }

                                </button>

                            ) : (

                                <button
                                    onClick={() =>
                                        setCurrentQuestion(
                                            currentQuestion + 1
                                        )
                                    }
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
                                >

                                    Next

                                </button>

                            )

                        }

                    </div>

                </div>

            </div>

        </LearnerLayout>

    );

}

export default Assessment;
