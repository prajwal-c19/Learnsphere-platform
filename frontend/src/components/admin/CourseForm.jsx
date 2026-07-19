import { useEffect, useRef, useState } from "react";
import { X, Image as ImageIcon, Upload, Tag as TagIcon, Plus } from "lucide-react";

const initialState = {
  title: "",
  description: "",
  category: "",
  duration: "",
  format: "",
  thumbnail: "",
  content_url: "",
};

const CATEGORY_OPTIONS = [
  "Web Development",
  "Data Structures",
  "Machine Learning",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "Other",
];

const FORMAT_OPTIONS = ["Live", "Recorded", "Self-paced", "Hybrid"];

// "Level" isn't a field on the backend CourseCreate schema yet — kept as
// local UI state only, not submitted, until the backend supports it.
const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

function CourseForm({ open, onClose, onSubmit, editingCourse }) {
  const [course, setCourse] = useState(initialState);
  const [level, setLevel] = useState("Beginner");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [customCategory, setCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCourse) {
      setCourse({
        title: editingCourse.title,
        description: editingCourse.description,
        category: editingCourse.category,
        duration: editingCourse.duration,
        format: editingCourse.format,
        thumbnail: editingCourse.thumbnail || "",
        content_url: editingCourse.content_url || "",
      });
      setCustomCategory(!CATEGORY_OPTIONS.includes(editingCourse.category));
    } else {
      setCourse(initialState);
      setCustomCategory(false);
    }

    setLevel("Beginner");
    setTags([]);
    setTagInput("");
    setErrors({});
  }, [editingCourse, open]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleCategorySelect = (e) => {
    if (e.target.value === "Other") {
      setCustomCategory(true);
      setCourse({ ...course, category: "" });
    } else {
      setCustomCategory(false);
      setCourse({ ...course, category: e.target.value });
    }
    setErrors({ ...errors, category: undefined });
  };

  // Converts a selected image file into a base64 data URI and stores it
  // directly in `thumbnail` — the schema only has a plain string field and
  // there's no separate file-upload endpoint, so this is real, working
  // "upload" without needing backend changes.
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCourse((prev) => ({ ...prev, thumbnail: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const validate = () => {
    const nextErrors = {};
    if (!course.title.trim()) nextErrors.title = "Title is required.";
    if (!course.description.trim())
      nextErrors.description = "Description is required.";
    if (!course.category.trim()) nextErrors.category = "Category is required.";
    if (!course.duration.trim()) nextErrors.duration = "Duration is required.";
    if (!course.format.trim()) nextErrors.format = "Format is required.";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      // Only fields the backend schema actually supports are submitted —
      // `level` and `tags` stay local until the backend adds those columns.
      await onSubmit(course);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 text-sm text-white bg-white/[0.05] border outline-none transition-colors placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-400/50 focus:border-red-400"
        : "border-white/10 focus:border-amber-400/40"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
            {editingCourse ? "Edit Course" : "Add Course"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Basic Information */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-300/80 mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={course.title}
                  onChange={handleChange}
                  className={inputClass("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>
                )}
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={course.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass("description")}
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Course Details */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-300/80 mb-4">
              Course Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {customCategory ? (
                  <input
                    type="text"
                    name="category"
                    placeholder="Custom category"
                    value={course.category}
                    onChange={handleChange}
                    className={inputClass("category")}
                  />
                ) : (
                  <select
                    value={
                      CATEGORY_OPTIONS.includes(course.category)
                        ? course.category
                        : ""
                    }
                    onChange={handleCategorySelect}
                    className={inputClass("category")}
                  >
                    <option value="" className="bg-slate-900">
                      Select category
                    </option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                )}
                {errors.category && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={inputClass("level")}
                  title="Not yet stored on the backend — visual only"
                >
                  {LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l} className="bg-slate-900">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g. 6 weeks)"
                  value={course.duration}
                  onChange={handleChange}
                  className={inputClass("duration")}
                />
                {errors.duration && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.duration}
                  </p>
                )}
              </div>

              <div>
                <select
                  name="format"
                  value={FORMAT_OPTIONS.includes(course.format) ? course.format : ""}
                  onChange={handleChange}
                  className={inputClass("format")}
                >
                  <option value="" className="bg-slate-900">
                    Select format
                  </option>
                  {FORMAT_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-slate-900">
                      {f}
                    </option>
                  ))}
                </select>
                {errors.format && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.format}</p>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono mt-2">
              Level is visual-only for now — the backend course schema
              doesn't store it yet.
            </p>
          </div>

          {/* Section: Media & Tags */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-300/80 mb-4">
              Media &amp; Tags
            </h3>

            <div className="space-y-4">
              {/* Thumbnail */}
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={22} className="text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="thumbnail"
                    placeholder="Thumbnail URL"
                    value={
                      course.thumbnail.startsWith("data:")
                        ? ""
                        : course.thumbnail
                    }
                    onChange={handleChange}
                    className={inputClass("thumbnail")}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-amber-400/30 hover:text-amber-200 transition-colors"
                  >
                    <Upload size={14} />
                    Upload image instead
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <input
                type="text"
                name="content_url"
                placeholder="Content URL"
                value={course.content_url}
                onChange={handleChange}
                className={inputClass("content_url")}
              />

              {/* Tags — local only, not part of the backend schema yet */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-500 font-mono">
                    Tags (visual only, not saved yet)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-200 px-3 py-1 text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter"
                    className={inputClass("tags")}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="shrink-0 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 text-sm font-medium hover:bg-white/[0.09] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting
                ? "Saving..."
                : editingCourse
                ? "Update Course"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseForm;