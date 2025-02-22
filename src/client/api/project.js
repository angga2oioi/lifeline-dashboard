//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const createProject = async (payload) => {

    const { data } = await Axios.post(`/v1/accounts/me/projects`, payload)
    return data.data

}

export const paginateMyProject = async (params) => {

    const { data } = await Axios.get(`/v1/accounts/me/projects`, {
        params
    })
    return data.data

}
