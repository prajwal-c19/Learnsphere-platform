import { useMemo, useState } from "react";
import {
  Trash2,
  Video,
  FileText,
  MoreVertical,
  Search,
  ArrowUpDown,
  Eye,
} from "lucide-react";

const PAGE_SIZE = 6;

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com.*(?:\?v=|\/embed\/|\/v\/))([^\s&?/]+)/
  );
  const videoId = match ? match[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function LessonTable({ lessons, onDelete }) {
  // Local search/sort/pagination refine whatever `lessons` array this
  // component receives — if a parent page also filters before passing
  // lessons down, this stacks on top of that rather than replacing it.
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("order");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [previewLesson, setPreviewLesson] = useState(null);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const processedLessons = useMemo(() => {
    let result = lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(search.toLowerCase())
    );

    result = [...result].sort((a, b) => {
      if (sortBy === "order") {
        return sortDir === "asc" ? a.order - b.order : b.order - a.order;
      }
      const aVal = (a[sortBy] || "").toString().toLowerCase();
      const bVal = (b[sortBy] || "").toString().toLowerCase();
      const compare = aVal.localeCompare(bVal);
      return sortDir === "asc" ? compare : -compare;
    });

    return result;
  }, [lessons, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processedLessons.length / PAGE_SIZE));
  const paginatedLessons = processedLessons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const SortHeader = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1.5 hover:text-rose-300 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={12}
        className={sortBy === field ? "text-rose-300" : "text-slate-600"}
      />
    </button>
  );

  const embedUrl = previewLesson ? getYoutubeEmbedUrl(previewLesson.video_url) : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      {/* Search */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-rose-400/40 rounded-lg px-3.5 py-2.5 max-w-sm transition-all duration-200">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search lessons..."
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-mono uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">
                <SortHeader field="order" label="Order" />
              </th>
              <th className="px-6 py-4">
                <SortHeader field="title" label="Lesson" />
              </th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Resources</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLessons.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14 text-slate-500">
                  No lessons added yet.
                </td>
              </tr>
            ) : (
              paginatedLessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="border-b border-white/5 last:border-0 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <span className="w-8 h-8 rounded-lg border border-rose-400/25 bg-rose-400/10 text-rose-300 text-sm font-mono font-semibold flex items-center justify-center">
                      {lesson.order}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-semibold text-white truncate max-w-[240px]">
                      {lesson.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 truncate max-w-[280px]">
                      {lesson.description}
                    </p>
                  </td>

                  {/* Duration — only if the API ever provides it */}
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {lesson.duration || (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-slate-400">
                      {lesson.video_url && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono">
                          <Video size={14} /> Video
                        </span>
                      )}
                      {lesson.notes_url && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono">
                          <FileText size={14} /> Notes
                        </span>
                      )}
                      {!lesson.video_url && !lesson.notes_url && (
                        <span className="text-slate-600 text-xs">None</span>
                      )}
                    </div>
                  </td>

                  {/* Status badge — only if the API ever provides it */}
                  <td className="px-6 py-4">
                    {typeof lesson.published === "boolean" ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-mono ${
                          lesson.published
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-400/30 bg-slate-400/10 text-slate-300"
                        }`}
                      >
                        {lesson.published ? "Published" : "Draft"}
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
                            openMenuId === lesson.id ? null : lesson.id
                          )
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-white/[0.06] transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === lesson.id && (
                        <>
                          <button
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setOpenMenuId(null)}
                            aria-label="Close menu"
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 animate-fade-in">
                            {(lesson.video_url || lesson.notes_url) && (
                              <button
                                onClick={() => {
                                  setPreviewLesson(lesson);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06] transition-colors"
                              >
                                <Eye size={16} className="text-sky-300" />
                                Preview
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onDelete(lesson.id);
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
      {processedLessons.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-t border-white/10 text-sm">
          <p className="text-slate-500 font-mono text-xs">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-rose-300 hover:border-rose-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 hover:text-rose-300 hover:border-rose-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in"
          onClick={() => setPreviewLesson(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {previewLesson.title}
            </h3>

            {embedUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title={previewLesson.title}
                  allowFullScreen
                />
              </div>
            ) : previewLesson.notes_url ? (
              <a
                href={previewLesson.notes_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-slate-200 hover:bg-white/[0.09] transition-colors"
              >
                <FileText size={18} />
                Open Resource
              </a>
            ) : (
              <p className="text-slate-400">No preview available.</p>
            )}

            <button
              onClick={() => setPreviewLesson(null)}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-white/[0.09] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonTable;