//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const listServiceInstances = async (serviceId) => {
    const { data } = await Axios.get(`/v1/services/${serviceId}/instances`)
    return data.data
}

export const getInstanceStatus = async (instanceId) => {
    const { data } = await Axios.get(`/v1/instances/${instanceId}/status`)
    return data.data
}

export const findInstanceById = async (instanceId) => {
    const { data } = await Axios.get(`/v1/instances/${instanceId}`)
    return data.data
}