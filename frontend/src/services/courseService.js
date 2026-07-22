import API from "../api/axios";

export const getCourses = async () => {

    const response = await API.get(
        "/courses"
    );

    return response.data;

};


export const getCourse = async (id) => {

    const response = await API.get(
        `/courses/${id}`
    );

    return response.data;

};


export const createCourse = async (course) => {

    const response = await API.post(
        "/courses",
        course
    );

    return response.data;

};

export const generateCourseDescription = async (
    courseName
) => {

    const response = await API.post(

        "/courses/generate-description",

        {
            course_name: courseName
        }

    );

    return response.data;

};

export const updateCourse = async (
    id,
    course
) => {

    const response = await API.put(
        `/courses/${id}`,
        course
    );

    return response.data;

};


export const deleteCourse = async (
    id
) => {

    const response = await API.delete(
        `/courses/${id}`
    );

    return response.data;

};

