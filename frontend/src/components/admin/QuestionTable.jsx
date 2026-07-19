import { useMemo, useState } from "react";
import {
  Trash2,
  MoreVertical,
  Search,
  ArrowUpDown,
  ListChecks,
} from "lucide-react";

const PAGE_SIZE = 6;

function QuestionTable({ questions, onDelete }) {
  // Local search/sort/pagination refine whatever `questions` array this
  // component receives — if a parent page also filters before passing
  // questions down, this stacks on top of that rather than replacing it.
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("question");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const processedQuestions = useMemo(() => {
    let result = questions.filter((q) =>
      q.question.toLowerCase().includes(search.toLowerCase())
    );

    result = [...result].sort((a, b) => {
      const aVal = (a[sortBy] || "").toString().toLowerCase();
      const bVal = (b[sortBy] || "").toString().toLowerCase();
      const compare = aVal.localeCompare(bVal);
      return sortDir === "asc" ? compare : -compare;
    });

    return result;
  }, [questions, search, sortBy, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedQuestions.length / PAGE_SIZE)
  );
  const paginatedQuestions = processedQuestions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const SortHeader = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1.5 hover:text-indigo-300 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={12}
        className={sortBy === field ? "text-indigo-300" : "text-slate-600"}
      />
    </button>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      {/* Search */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-indigo-400/40 rounded-lg px-3.5 py-2.5 max-w-sm transition-all duration-200">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search questions..."
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-mono uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">
                <SortHeader field="question" label="Question" />
              </th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">
                <SortHeader field="correct_answer" label="Correct Answer" />
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedQuestions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-14 text-slate-500">
                  No Questions Found
                </td>
              </tr>
            ) : (
              paginatedQuestions.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-white/5 last:border-0 align-top transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white max-w-[280px]">
                      {question.question}
                    </p>
                    <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                      <p>
                        <strong className="text-slate-400">A:</strong>{" "}
                        {question.option_a}
                      </p>
                      <p>
                        <strong className="text-slate-400">B:</strong>{" "}
                        {question.option_b}
                      </p>
                      <p>
                        <strong className="text-slate-400">C:</strong>{" "}
                        {question.option_c}
                      </p>
                      <p>
                        <strong className="text-slate-400">D:</strong>{" "}
                        {question.option_d}
                      </p>
                    </div>
                  </td>

                  {/* Question type — every question in this schema is
                      structurally 4-option multiple choice, so this is a
                      true derived fact, not fabricated data. */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-400/10 text-indigo-300 px-2.5 py-1 text-[11px] font-mono">
                      <ListChecks size={12} />
                      MCQ
                    </span>
                  </td>

                  {/* Difficulty — only if the API ever provides it */}
                  <td className="px-6 py-4">
                    {question.difficulty ? (
                      <span className="rounded-full border border-violet-400/25 bg-violet-400/10 text-violet-300 px-2.5 py-1 text-[11px] font-mono">
                        {question.difficulty}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Category — only if the API ever provides it */}
                  <td className="px-6 py-4">
                    {question.category ? (
                      <span className="rounded-full border border-sky-400/25 bg-sky-400/10 text-sky-300 px-2.5 py-1 text-[11px] font-mono">
                        {question.category}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 px-2.5 py-1 text-xs font-mono">
                      {question.correct_answer}
                    </span>
                  </td>

                  {/* Status — only if the API ever provides it */}
                  <td className="px-6 py-4">
                    {typeof question.published === "boolean" ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-mono ${
                          question.published
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-400/30 bg-slate-400/10 text-slate-300"
                        }`}
                      >
                        {question.published ? "Active" : "Draft"}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Action menu */}
                  <td className="px-6 py-4">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === question.id ? null : question.id
                          )
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/[0.06] transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === question.id && (
                        <>
                          <button
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setOpenMenuId(null)}
                            aria-label="Close menu"
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 animate-fade-in">
                            <button
                              onClick={() => {
                                onDelete(question.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-400/10 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedQuestions.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-t border-white/10 text-sm">
          <p className="text-slate-500 font-mono text-xs">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-indigo-300 hover:border-indigo-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-indigo-300 hover:border-indigo-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionTable;