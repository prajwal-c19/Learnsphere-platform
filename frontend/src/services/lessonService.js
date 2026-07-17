import API from "../api/axios";

/* ==========================================
   Lesson APIs
========================================== */

export const getLessonsByCourse = async (courseId) => {

    const response = await API.get(
        `/lessons/course/${courseId}`
    );

    return response.data;

};

export const getCourseProgress = async (courseId) => {

    const response = await API.get(
        `/lessons/course/${courseId}/progress`
    );

    return response.data;

};

export const createLesson = async (lesson) => {

    const response = await API.post(
        "/lessons",
        lesson
    );

    return response.data;

};

export const deleteLesson = async (id) => {

    const response = await API.delete(
        `/lessons/${id}`
    );

    return response.data;

};

export const completeLesson = async (lessonId) => {

    const response = await API.post(
        `/lessons/${lessonId}/complete`
    );

    return response.data;

};


/* ==========================================
   Upload Video
========================================== */

export const uploadLessonVideo = async (
    file,
    onUploadProgress
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await API.post(

        "/lessons/upload-video",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data",

            },

            onUploadProgress,

        }

    );

    return response.data;

};