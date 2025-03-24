//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const getCsrfToken = async () => {
    const { data } = await Axios.get(`/v1/auths/csrf`)
    return data.data
}

export const accountLogin = async ( payload) => {

    const csrf = await getCsrfToken()
    const { data } = await Axios.post(`/v1/auths/login`, payload, {
        headers: {
            "X-CSRF-TOKEN": csrf
        }
    })
    return data.data

}

export const accountLogout = async () => {

    const { data } = await Axios.post(`/v1/auths/logout`, {})
    return data.data

}


export const setupAccount = async ( payload) => {
    const csrf = await getCsrfToken()
    const { data } = await Axios.post(`/v1/auths/setup`, payload, {
        headers: {
            "X-CSRF-TOKEN": csrf
        }
    })
    return data.data

}