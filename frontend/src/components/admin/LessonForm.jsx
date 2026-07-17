import { useEffect, useState } from "react";

import {

    Upload,

    PlayCircle,

    Loader2

} from "lucide-react";

import {

    uploadLessonVideo

} from "../../services/lessonService";


const initialState = {

    title: "",

    description: "",

    video_type: "youtube",

    video_url: "",

    notes_url: "",

    order: 1

};


function LessonForm({

    open,

    courseId,

    onClose,

    onSubmit,

    nextOrder

}) {

    const [formData, setFormData] = useState(initialState);

    const [videoFile, setVideoFile] = useState(null);

    const [uploading, setUploading] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    const [error, setError] = useState("");

    useEffect(() => {

        if (open) {

            setFormData({

                ...initialState,

                order: nextOrder || 1

            });

            setVideoFile(null);

            setUploadProgress(0);

            setUploading(false);

            setError("");

        }

    }, [open, nextOrder]);


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleVideoSource = (type) => {

        setFormData({

            ...formData,

            video_type: type,

            video_url: ""

        });

        setVideoFile(null);

        setUploadProgress(0);

        setError("");

    };


    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const allowed = [

            "video/mp4",

            "video/quicktime",

            "video/x-msvideo",

            "video/webm"

        ];

        if (!allowed.includes(file.type)) {

            setError(

                "Only MP4, MOV, AVI and WEBM videos are allowed."

            );

            return;

        }

        if (

            file.size >

            200 * 1024 * 1024

        ) {

            setError(

                "Maximum upload size is 200 MB."

            );

            return;

        }

        setError("");

        setVideoFile(file);

    };
        const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");

            let lessonData = {

                course_id: Number(courseId),

                ...formData,

                order: Number(formData.order),

            };

            // ==========================================
            // Upload Local Video
            // ==========================================

            if (formData.video_type === "upload") {

                if (!videoFile) {

                    setError(
                        "Please select a video."
                    );

                    return;

                }

                setUploading(true);

                const uploadResponse =
                    await uploadLessonVideo(

                        videoFile,

                        (progressEvent) => {

                            const progress = Math.round(

                                (
                                    progressEvent.loaded /
                                    progressEvent.total
                                ) * 100

                            );

                            setUploadProgress(progress);

                        }

                    );

                lessonData.video_url =
                    uploadResponse.video_url;

                lessonData.video_type =
                    uploadResponse.video_type;

                setUploading(false);

            }

            // ==========================================
            // Create Lesson
            // ==========================================

            await onSubmit(
                lessonData
            );

        }

        catch (error) {

            console.error(error);

            setUploading(false);

            setError(

                error?.response?.data?.detail ||

                "Failed to create lesson."

            );

        }

    };
        if (!open) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

                <h2 className="text-3xl font-bold mb-8">

                    Add Lesson

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <input
                        type="text"
                        name="title"
                        placeholder="Lesson Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Lesson Description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    {/* ================================= */}
                    {/* Video Source */}
                    {/* ================================= */}

                    <div>

                        <label className="font-semibold block mb-4">

                            Video Source

                        </label>

                        <div className="grid grid-cols-2 gap-4">

                            <button

                                type="button"

                                onClick={() =>
                                    handleVideoSource("youtube")
                                }

                                className={`rounded-xl border p-4 flex items-center justify-center gap-3 transition

                                ${

                                    formData.video_type === "youtube"

                                        ? "border-red-500 bg-red-50 text-red-600"

                                        : "border-slate-300"

                                }`}

                            >

                                <PlayCircle size={22} />

                                YouTube

                            </button>

                            <button

                                type="button"

                                onClick={() =>
                                    handleVideoSource("upload")
                                }

                                className={`rounded-xl border p-4 flex items-center justify-center gap-3 transition

                                ${

                                    formData.video_type === "upload"

                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"

                                        : "border-slate-300"

                                }`}

                            >

                                <Upload size={22} />

                                Upload Video

                            </button>

                        </div>

                    </div>

                    {

                        formData.video_type === "youtube"

                        &&

                        (

                            <input

                                type="text"

                                name="video_url"

                                placeholder="Paste YouTube URL"

                                value={formData.video_url}

                                onChange={handleChange}

                                className="w-full border rounded-xl p-3"

                            />

                        )

                    }

                    {

                        formData.video_type === "upload"

                        &&

                        (

                            <div className="space-y-4">

                                <input

                                    type="file"

                                    accept=".mp4,.mov,.avi,.webm"

                                    onChange={handleFileChange}

                                    className="w-full border rounded-xl p-3"

                                />

                                {

                                    videoFile &&

                                    (

                                        <div className="text-sm text-slate-600">

                                            Selected:

                                            <span className="font-semibold ml-2">

                                                {videoFile.name}

                                            </span>

                                        </div>

                                    )

                                }

                                {

                                    uploading &&

                                    (

                                        <div>

                                            <div className="flex items-center gap-3 mb-2">

                                                <Loader2
                                                    className="animate-spin"
                                                    size={18}
                                                />

                                                Uploading...

                                            </div>

                                            <div className="w-full bg-slate-200 rounded-full h-3">

                                                <div

                                                    className="bg-indigo-600 h-3 rounded-full transition-all"

                                                    style={{

                                                        width: `${uploadProgress}%`

                                                    }}

                                                />

                                            </div>

                                            <p className="mt-2 text-sm">

                                                {uploadProgress}%

                                            </p>

                                        </div>

                                    )

                                }

                            </div>

                        )

                    }

                    <input

                        type="text"

                        name="notes_url"

                        placeholder="Notes / PDF URL"

                        value={formData.notes_url}

                        onChange={handleChange}

                        className="w-full border rounded-xl p-3"

                    />

                    <input

                        type="number"

                        name="order"

                        value={formData.order}

                        onChange={handleChange}

                        min="1"

                        className="w-full border rounded-xl p-3"

                    />

                    {

                        error &&

                        (

                            <div className="rounded-xl bg-red-100 text-red-700 px-4 py-3">

                                {error}

                            </div>

                        )

                    }
                                        <div className="flex justify-end gap-4 pt-6">

                        <button

                            type="button"

                            onClick={onClose}

                            disabled={uploading}

                            className="px-6 py-3 rounded-xl bg-slate-300 hover:bg-slate-400 disabled:opacity-50"

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            disabled={uploading}

                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"

                        >

                            {

                                uploading

                                ?

                                <>

                                    <Loader2

                                        size={18}

                                        className="animate-spin"

                                    />

                                    Uploading...

                                </>

                                :

                                "Save Lesson"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default LessonForm;