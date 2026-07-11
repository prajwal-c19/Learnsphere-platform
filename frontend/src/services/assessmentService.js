import API from "../api/axios";

/* =========================================
   Learner APIs
========================================= */

export const getAssessmentByCourse = async (courseId) => {

    const response = await API.get(
        `/assessments/course/${courseId}`
    );

    return response.data;

};

export const getQuestions = async (assessmentId) => {

    const response = await API.get(
        `/questions/assessment/${assessmentId}`
    );

    return response.data;

};

export const submitAssessment = async (
    assessmentId,
    answers
) => {

    const response = await API.post(
        "/results/submit",
        {
            assessment_id: assessmentId,
            answers: answers
        }
    );

    return response.data;

};


/* =========================================
   Admin - Assessment APIs
========================================= */

export const getAllAssessments = async () => {

    const response = await API.get(
        "/assessments"
    );

    return response.data;

};

export const createAssessment = async (
    assessment
) => {

    const response = await API.post(
        "/assessments",
        assessment
    );

    return response.data;

};

export const updateAssessment = async (
    id,
    assessment
) => {

    const response = await API.put(
        `/assessments/${id}`,
        assessment
    );

    return response.data;

};

export const deleteAssessment = async (
    id
) => {

    const response = await API.delete(
        `/assessments/${id}`
    );

    return response.data;

};


/* =========================================
   Admin - Question APIs
========================================= */

export const createQuestion = async (
    question
) => {

    const response = await API.post(
        "/questions",
        question
    );

    return response.data;

};

export const deleteQuestion = async (
    id
) => {

    const response = await API.delete(
        `/questions/${id}`
    );

    return response.data;

};

export const getAssessment = async (assessmentId) => {

    const response = await API.get(
        `/assessments/${assessmentId}`
    );

    return response.data;

};
