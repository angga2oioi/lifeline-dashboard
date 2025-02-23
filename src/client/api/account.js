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

export const listAllAccount = async () => {

    let page = 1
    let res = []
    while (true) {
        let list = await paginateAccount({ page })
        if (list?.results?.length < 1) {
            break;
        }

        res = [...res, ...list?.results]
        page += 1
    }

    return res
}

export const createAccount = async (payload) => {

    const { data } = await Axios.post(`/v1/accounts`, payload)
    return data.data

}

export const updateAccount = async (id, payload) => {

    const { data } = await Axios.put(`/v1/accounts/${id}`, payload)
    return data.data

}

export const removeAccount = async (id) => {

    const { data } = await Axios.delete(`/v1/accounts/${id}`)
    return data.data

}
