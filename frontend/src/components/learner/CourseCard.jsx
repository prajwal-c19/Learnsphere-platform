import { useState } from "react";
import { enrollCourse } from "../../services/enrollmentService";

function CourseCard({ course }) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const response = await enrollCourse(course.id);

      alert(response.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {course.title}
          </h2>

          <p className="text-slate-500 mt-2">
            {course.description}
          </p>

        </div>

        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
          {course.category}
        </span>

      </div>

      <div className="flex gap-6 mt-6 text-sm text-slate-600">

        <div>
          <strong>Duration:</strong> {course.duration}
        </div>

        <div>
          <strong>Format:</strong> {course.format}
        </div>

      </div>

      <button
        onClick={handleEnroll}
        disabled={loading}
        className="mt-6 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition disabled:bg-slate-400"
      >
        {loading ? "Enrolling..." : "Enroll Now"}
      </button>

    </div>
  );
}

export default CourseCard;
