import { useEffect, useRef, useState } from "react";
import { X, Video, FileText, Upload, Eye, Clock } from "lucide-react";

const initialState = {
  title: "",
  description: "",
  video_url: "",
  notes_url: "",
  order: 1,
};

function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com.*(?:\?v=|\/embed\/|\/v\/))([^\s&?/]+)/
  );

  const videoId = match ? match[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function LessonForm({ open, courseId, onClose, onSubmit, nextOrder }) {
  const [formData, setFormData] = useState(initialState);
  // "Duration" isn't a field on the backend LessonCreate schema yet —
  // kept as local UI state only, not submitted, until it's added there.
  const [duration, setDuration] = useState("");
  const [errors, setErrors] = useState({});
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const notesInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialState,
        order: nextOrder || 1,
      });
      setDuration("");
      setErrors({});
      setShowVideoPreview(false);
    }
  }, [open, nextOrder]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  // Real, working "upload" for the notes/resource field: notes_url is a
  // plain string in the schema (rendered as a plain download link
  // elsewhere), so a base64 data URI works fine there. Video stays
  // URL-only below, since CourseLessons.jsx parses video_url specifically
  // as a YouTube link to build its embed — an uploaded file wouldn't embed.
  const handleResourceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, notes_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters.";
    }
    if (!formData.order || Number(formData.order) < 1) {
      nextErrors.order = "Order must be 1 or higher.";
    }
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Only fields the backend schema supports are submitted — `duration`
    // stays local until the Lesson model has a column for it.
    onSubmit({
      course_id: Number(courseId),
      ...formData,
      order: Number(formData.order),
    });
  };

  if (!open) return null;

  const embedUrl = getYoutubeEmbedUrl(formData.video_url);
  const isUploadedResource = formData.notes_url.startsWith("data:");

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 text-sm text-white bg-white/[0.05] border outline-none transition-colors placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-400/50 focus:border-red-400"
        : "border-white/10 focus:border-teal-400/40"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 animate-fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-teal-200 to-sky-300 bg-clip-text text-transparent">
            Add Lesson
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Lesson Title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>
            )}
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={inputClass("description")}
          />

          {/* Video */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Video size={14} className="text-slate-500" />
              <span className="text-xs text-slate-500 font-mono">
                Video URL (YouTube)
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="video_url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.video_url}
                onChange={handleChange}
                className={inputClass("video_url")}
              />
              {embedUrl && (
                <button
                  type="button"
                  onClick={() => setShowVideoPreview((prev) => !prev)}
                  title="Preview video"
                  className="shrink-0 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-teal-300 hover:border-teal-400/30 transition-colors"
                >
                  <Eye size={16} />
                </button>
              )}
            </div>

            {showVideoPreview && embedUrl && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black animate-fade-in">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="Video preview"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Notes / Resource */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-slate-500" />
              <span className="text-xs text-slate-500 font-mono">
                Notes / Resource
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="notes_url"
                placeholder="Google Drive link"
                value={isUploadedResource ? "" : formData.notes_url}
                onChange={handleChange}
                className={inputClass("notes_url")}
              />
              {formData.notes_url && (
                <a
                  href={formData.notes_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Preview resource"
                  className="shrink-0 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-teal-300 hover:border-teal-400/30 flex items-center justify-center transition-colors"
                >
                  <Eye size={16} />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => notesInputRef.current?.click()}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-teal-400/30 hover:text-teal-200 transition-colors"
            >
              <Upload size={14} />
              Upload file instead
            </button>
            <input
              ref={notesInputRef}
              type="file"
              onChange={handleResourceUpload}
              className="hidden"
            />
            {isUploadedResource && (
              <p className="text-[11px] text-teal-300/80 font-mono mt-1.5">
                File attached — stored directly on this lesson.
              </p>
            )}
          </div>

          {/* Duration + Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-mono">
                  Duration (visual only)
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. 12 min"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputClass("duration")}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 font-mono">
                  Lesson Order
                </span>
              </div>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className={inputClass("order")}
              />
              {errors.order && (
                <p className="text-xs text-red-400 mt-1.5">{errors.order}</p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            Duration is visual-only for now — the backend lesson schema
            doesn't store it yet.
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-sky-500 text-black text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonForm;