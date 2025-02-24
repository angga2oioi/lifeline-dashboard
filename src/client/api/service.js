//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const listProjectServices = async (projectId) => {
    const { data } = await Axios.get(`/v1/projects/${projectId}/services`)
    return data.data
}


export const createService = async (projectId, payload) => {

    const { data } = await Axios.post(`/v1/projects/${projectId}/services`, payload)
    return data.data

}

export const removeService = async (id, payload) => {

    const { data } = await Axios.delete(`/v1/services/${id}`)
    return data.data


}

export const updateService = async (id, payload) => {

    const { data } = await Axios.put(`/v1/services/${id}`, payload)
    return data.data

}

export const findServicedById = async (serviceId) => {
    const { data } = await Axios.get(`/v1/services/${serviceId}`)
    return data.data
}
