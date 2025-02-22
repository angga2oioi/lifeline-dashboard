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

export const paginateAccount = async (params) => {

    const { data } = await Axios.get(`/v1/accounts`, {
        params
    })
    return data.data

}

export const createAccount = async (payload) => {

    const { data } = await Axios.post(`/v1/accounts`, payload)
    return data.data

}

export const removeAccount = async (id) => {

    const { data } = await Axios.delete(`/v1/accounts/${id}`)
    return data.data

}
