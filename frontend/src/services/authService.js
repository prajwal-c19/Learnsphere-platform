import API from "../api/axios";

export const loginUser = async (email, password) => {
    const response = await API.post("/auth/login", {
        email,
        password,
    });

    return response.data;
};
