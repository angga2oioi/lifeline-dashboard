//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, minMaxNum } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import projectModel from "../project/project.model";
import serviceModel from "./service.model";
import striptags from "striptags";
import mongoose from "mongoose";

const {
    ObjectId
} = mongoose.Types

export const createService = async (params) => {
    const v = new Validator(params, {
        name: "required|string",
        project: "require|string"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const project = await projectModel.findById(params?.project)
    if (!project) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    let raw = await serviceModel.create({
        project: project._id,
        name: striptags(params?.name)
    })

    return raw?.toJSON()
}

export const findServiceById = async (id) => {
    const raw = await serviceModel.findById(id)
    if (!raw) {
        return null
    }

    return raw?.toJSON()
}

export const updateService = async (id, params) => {
    const service = await serviceModel.findById(id)
    if (!service) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const v = new Validator(params, {
        name: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    await serviceModel.findByIdAndUpdate(id, {
        $set: {
            name: striptags(params?.name)
        }
    })

    return findServiceById(id)
}

export const removeService = async (id) => {
    const raw = await serviceModel.findById(id)
    if (!raw) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await serviceModel.findByIdAndDelete(id)
    return null
}

const buildServiceSearchQuery = (params) => {
    let query = {}
    if (params?.search) {
        query.$or = [
            {
                name: {
                    $regex: params?.search,
                    $options: "i"
                }
            }
        ]
    }

    if (params?.project) {
        query.project = new ObjectId(params?.project)
    }

    return query
}

export const paginateService = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {
    let queryParams = buildServiceSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    let list = await serviceModel.paginate(queryParams, { sortBy, limit, page })
    list.results = list?.results?.map((n) => {
        return n?.toJSON()
    })

    return list
}