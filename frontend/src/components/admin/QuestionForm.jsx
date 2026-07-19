import { useEffect, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

const initialState = {
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
};

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const CATEGORY_OPTIONS = [
  "Concepts",
  "Syntax",
  "Problem Solving",
  "Applied",
  "Theory",
];

function QuestionForm({ open, assessmentId, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  // Difficulty & category aren't fields on the backend QuestionCreate
  // schema yet — kept as local UI state only, not submitted.
  const [difficulty, setDifficulty] = useState("Medium");
  const [category, setCategory] = useState("Concepts");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialState);
      setDifficulty("Medium");
      setCategory("Concepts");
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const options = [
    { key: "A", field: "option_a" },
    { key: "B", field: "option_b" },
    { key: "C", field: "option_c" },
    { key: "D", field: "option_d" },
  ];

  const validate = () => {
    const nextErrors = {};
    if (!formData.question.trim()) {
      nextErrors.question = "Question text is required.";
    }
    options.forEach(({ key, field }) => {
      if (!formData[field].trim()) {
        nextErrors[field] = `Option ${key} is required.`;
      }
    });
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Only fields the backend schema supports are submitted — difficulty
    // and category stay local until the Question model has columns for
    // them.
    onSubmit({
      assessment_id: Number(assessmentId),
      ...formData,
    });
  };

  if (!open) return null;

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 text-sm text-white bg-white/[0.05] border outline-none transition-colors placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-400/50 focus:border-red-400"
        : "border-white/10 focus:border-emerald-400/40"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-lime-300 bg-clip-text text-transparent">
            Add Question
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/80">
                Question
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {formData.question.length} chars
              </span>
            </div>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the question text..."
              rows={3}
              className={inputClass("question")}
            />
            {errors.question && (
              <p className="text-xs text-red-400 mt-1.5">{errors.question}</p>
            )}
          </div>

          {/* Options + correct-answer selector combined */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/80 mb-2 block">
              Answer Options
            </span>
            <p className="text-[11px] text-slate-500 mb-3">
              Select the radio button next to the correct option.
            </p>

            <div className="space-y-3">
              {options.map(({ key, field }) => {
                const isCorrect = formData.correct_answer === key;

                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-200 ${
                      isCorrect
                        ? "border-emerald-400/40 bg-emerald-400/[0.06]"
                        : "border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, correct_answer: key })
                      }
                      title={`Mark ${key} as correct`}
                      className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-400 text-black"
                          : "border-white/20 text-slate-400 hover:border-emerald-400/40 hover:text-emerald-300"
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 size={16} /> : key}
                    </button>

                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Option ${key}`}
                      className={`flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 ${
                        errors[field] ? "border-b border-red-400/50" : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            {options.some(({ field }) => errors[field]) && (
              <p className="text-xs text-red-400 mt-2">
                All four options are required.
              </p>
            )}
          </div>

          {/* Difficulty & category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/80 mb-2 block">
                Difficulty
              </span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={inputClass("difficulty")}
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/80 mb-2 block">
                Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass("category")}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            Difficulty and category are visual-only for now — the backend
            question schema doesn't store them yet.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 text-sm font-medium hover:bg-white/[0.09] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 text-black text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;