import API from "../api/axios";

export const enrollCourse = async (courseId) => {

    const response = await API.post(
        "/enrollments/",
        {
            course_id: courseId,
        }
    );

    return response.data;
};


export const getMyEnrollments = async () => {

    const response = await API.get(
        "/enrollments/my"
    );

    return response.data;
};


export const updateProgress = async (courseId) => {

    const response = await API.patch(
        `/enrollments/${courseId}/progress`
    );

    return response.data;
};
