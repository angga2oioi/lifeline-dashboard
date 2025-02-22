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

export const listAllMyProject = async () => {

    let page = 1
    let res = []
    while (true) {
        let list = await paginateMyProject({ page })
        if (list?.results?.length < 1) {
            break;
        }

        res = [...res, ...list?.results]
        page += 1
    }

    return res
}