import API from "../api/axios";

export const getLeaderboard = async () => {

    const response = await API.get(
        "/dashboard/leaderboard"
    );

    return response.data;

};