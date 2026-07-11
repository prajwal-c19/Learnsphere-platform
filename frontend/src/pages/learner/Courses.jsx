import { useEffect, useState } from "react";
import LearnerLayout from "../../layouts/LearnerLayout";
import CourseCard from "../../components/learner/CourseCard";
import { getCourses } from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();

        console.log("Courses from API:", data); // <-- Add this

        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <LearnerLayout>
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </LearnerLayout>
  );
}

export default Courses;
