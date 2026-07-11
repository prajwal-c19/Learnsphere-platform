import API from "../api/axios";

export const getProfile = async () => {

    const response = await API.get(
        "/profile/me"
    );

    return response.data;

};
