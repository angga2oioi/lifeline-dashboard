//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const getMyStatuses = async (payload) => {

    const { data } = await Axios.get(`/v1/accounts/me/status`)
    return data.data

}
