import {
    Clock,
    Tag,
    MonitorPlay,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {

    const navigate = useNavigate();

    const tags = course.category
        ? course.category
            .split(",")
            .map(tag => tag.trim())
        : [];

    return (

        <div

            onClick={() => navigate(`/courses/${course.id}`)}

            className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"

        >
                      {/* Thumbnail */}

            <img

                src={

                    course.thumbnail

                        ? (

                            course.thumbnail.startsWith("/")

                                ? `http://127.0.0.1:8000${course.thumbnail}`

                                : `http://127.0.0.1:8000/uploads/thumbnails/${course.thumbnail}`

                        )

                        : "https://placehold.co/600x350/e2e8f0/475569?text=Course"

                }

                alt={course.title}

                className="w-full h-48 object-cover"

            />

            <div className="p-6 flex flex-col flex-1">

                {/* Course Title */}

                <h2 className="text-xl font-bold text-slate-800 mb-3">

                    {course.title}

                </h2>

                {/* Tags */}

                <div className="flex flex-wrap gap-2 mb-4">

                    {

                        tags.map((tag, index) => (

                            <span

                                key={index}

                                className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"

                            >

                                <Tag size={12} />

                                {tag}

                            </span>

                        ))

                    }

                </div>

                {/* Description */}

                <p

                    className="text-slate-600 text-sm leading-6 flex-1"

                    style={{

                        display: "-webkit-box",

                        WebkitLineClamp: 2,

                        WebkitBoxOrient: "vertical",

                        overflow: "hidden",

                    }}

                >

                    {course.description}

                </p>

                {/* Footer */}

                <div className="flex justify-between items-center text-sm text-slate-500 mt-6 border-t pt-4">

                    <div className="flex items-center gap-2">

                        <Clock
                            size={16}
                            className="text-indigo-600"
                        />

                        <span>

                            {course.duration} mins

                        </span>

                    </div>

                    <div className="flex items-center gap-2">

                        <MonitorPlay
                            size={16}
                            className="text-indigo-600"
                        />

                        <span>

                            {course.format}

                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CourseCard;