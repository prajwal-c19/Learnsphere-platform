import API from "../api/axios";

export const getResultHistory = async () => {

    const response = await API.get(
        "/results/history"
    );

    return response.data;

};