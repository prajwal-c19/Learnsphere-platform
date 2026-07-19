import { useEffect, useState } from "react";

import {

    BookOpen,

    ClipboardList,

    Percent,

    Clock,

    CheckCircle2,

    AlertCircle,

    X

} from "lucide-react";


const initialState = {
    course_id: "",
    title: "",
    total_questions: 10,
    pass_percentage: 80,
    duration_minutes: ""
};


function AssessmentForm({

    open,
    onClose,
    onSubmit,
    editingAssessment,
    courses

}) {

    const [assessment, setAssessment] = useState(initialState);

    const [touched, setTouched] = useState(false);

    useEffect(() => {

        if (editingAssessment) {

            setAssessment({

                course_id: editingAssessment.course_id,
                title: editingAssessment.title,
                total_questions: editingAssessment.total_questions,
                pass_percentage: editingAssessment.pass_percentage,
                duration_minutes: editingAssessment.duration_minutes || ""

            });

        }

        else {

            setAssessment(initialState);

        }

        setTouched(false);

    }, [editingAssessment, open]);

    const handleChange = (e) => {

        setAssessment({

            ...assessment,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        setTouched(true);

        // duration_minutes is intentionally left out of the payload — the
        // backend AssessmentCreate/AssessmentResponse schema doesn't have
        // this field, so submitting it would silently be dropped by
        // FastAPI, making it look saved when it isn't. It's kept as local
        // UI state only until the backend supports it.
        const { duration_minutes, ...submittable } = assessment;

        onSubmit({

            ...submittable,

            course_id: Number(assessment.course_id),
            total_questions: Number(assessment.total_questions),
            pass_percentage: Number(assessment.pass_percentage)

        });

    };

    if (!open) return null;

    const isCourseInvalid = touched && !assessment.course_id;

    const isTitleInvalid = touched && assessment.title.trim().length < 3;

    const isReady =

        assessment.course_id &&

        assessment.title.trim().length >= 3 &&

        Number(assessment.total_questions) > 0 &&

        Number(assessment.pass_percentage) >= 1 &&

        Number(assessment.pass_percentage) <= 100;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

            <style>{`
                @keyframes assessmentFormIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            <div
                className="
                    w-full max-w-xl max-h-[90vh] overflow-y-auto
                    rounded-3xl p-8
                    bg-white/80 backdrop-blur-2xl
                    border border-white/40
                    shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)]
                "
                style={{ animation: "assessmentFormIn 0.25s ease-out" }}
            >

                <div className="mb-8 flex items-start justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">

                            {

                                editingAssessment

                                    ? "Edit Assessment"

                                    : "Create Assessment"

                            }

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Configure the assessment details below.
                        </p>

                    </div>

                    <button

                        type="button"

                        onClick={onClose}

                        className="
                            flex h-9 w-9 items-center justify-center rounded-full
                            text-slate-400 hover:text-slate-600
                            hover:bg-slate-100
                            transition-colors duration-200
                        "

                    >
                        <X size={18} />
                    </button>

                </div>

                {

                    isReady && (

                        <div
                            className="
                                mb-6 flex items-center gap-2 rounded-full
                                border border-emerald-200 bg-emerald-50 px-3 py-1.5
                                text-xs font-semibold text-emerald-700 w-fit
                            "
                        >
                            <CheckCircle2 size={13} />
                            Ready to save
                        </div>

                    )

                }

                <form

                    onSubmit={handleSubmit}

                    className="space-y-5"

                >

                    <div>

                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <BookOpen size={14} className="text-fuchsia-500" />
                            Course
                        </label>

                        <select

                            name="course_id"

                            value={assessment.course_id}

                            onChange={handleChange}

                            className={`
                                w-full rounded-xl border p-3 bg-white/70
                                transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${
                                    isCourseInvalid
                                        ? "border-rose-300 focus:ring-rose-500/50 focus:border-rose-500"
                                        : "border-slate-200 focus:ring-fuchsia-500/50 focus:border-fuchsia-500"
                                }
                            `}

                        >

                            <option value="">

                                Select Course

                            </option>

                            {

                                courses.map((course) => (

                                    <option

                                        key={course.id}

                                        value={course.id}

                                    >

                                        {course.title}

                                    </option>

                                ))

                            }

                        </select>

                        {

                            isCourseInvalid && (

                                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                                    <AlertCircle size={12} />
                                    Please select a course.
                                </p>

                            )

                        }

                    </div>

                    <div>

                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <ClipboardList size={14} className="text-fuchsia-500" />
                            Assessment Title
                        </label>

                        <input

                            type="text"

                            name="title"

                            placeholder="e.g. Module 1 Final Quiz"

                            value={assessment.title}

                            onChange={handleChange}

                            className={`
                                w-full rounded-xl border p-3 bg-white/70
                                transition-all duration-200
                                focus:outline-none focus:ring-2
                                ${
                                    isTitleInvalid
                                        ? "border-rose-300 focus:ring-rose-500/50 focus:border-rose-500"
                                        : "border-slate-200 focus:ring-fuchsia-500/50 focus:border-fuchsia-500"
                                }
                            `}

                        />

                        {

                            isTitleInvalid && (

                                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                                    <AlertCircle size={12} />
                                    Title must be at least 3 characters.
                                </p>

                            )

                        }

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                <ClipboardList size={14} className="text-orange-500" />
                                Total Questions
                            </label>

                            <input

                                type="number"

                                name="total_questions"

                                value={assessment.total_questions}

                                onChange={handleChange}

                                min="1"

                                required

                                className="
                                    w-full rounded-xl border border-slate-200 p-3 bg-white/70
                                    transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
                                "

                            />

                        </div>

                        <div>

                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                <Percent size={14} className="text-orange-500" />
                                Passing Score
                            </label>

                            <input

                                type="number"

                                name="pass_percentage"

                                value={assessment.pass_percentage}

                                onChange={handleChange}

                                min="1"

                                max="100"

                                required

                                className="
                                    w-full rounded-xl border border-slate-200 p-3 bg-white/70
                                    transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
                                "

                            />

                        </div>

                    </div>

                    <div>

                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            <Clock size={14} className="text-orange-500" />
                            Duration (minutes)
                        </label>

                        <input

                            type="number"

                            name="duration_minutes"

                            placeholder="e.g. 30"

                            value={assessment.duration_minutes}

                            onChange={handleChange}

                            min="1"

                            className="
                                w-full rounded-xl border border-slate-200 p-3 bg-white/70
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
                            "

                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Visual only for now — not saved yet (backend doesn't store duration).
                        </p>

                    </div>

                    <div className="flex justify-end gap-4 pt-4">

                        <button

                            type="button"

                            onClick={onClose}

                            className="
                                rounded-xl px-6 py-3 font-medium
                                bg-slate-100 text-slate-600
                                transition-colors duration-200
                                hover:bg-slate-200
                            "

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="
                                rounded-xl px-6 py-3 font-semibold text-white
                                bg-gradient-to-r from-fuchsia-600 to-orange-500
                                shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)]
                                transition-all duration-200
                                hover:shadow-[0_10px_26px_-6px_rgba(217,70,239,0.65)]
                                hover:brightness-105
                            "

                        >

                            {

                                editingAssessment

                                    ? "Update Assessment"

                                    : "Create Assessment"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AssessmentForm;