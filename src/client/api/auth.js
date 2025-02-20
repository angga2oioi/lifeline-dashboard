//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const accountLogin = async (payload) => {

    const { data } = await Axios.post(`/v1/auths/login`, payload)
    return data.data

}