//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const paginateInstancesEvents = async (instanceId, params) => {
    const { data } = await Axios.get(`/v1/instances/${instanceId}/events`, {
        params
    })
    return data.data
}