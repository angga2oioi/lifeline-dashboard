//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { createSlug, HttpError, minMaxNum, parseSortBy } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import instanceModel from "../instance/instance.model";
import striptags from "striptags";
import eventModel from "./event.model";
import mongoose from "mongoose";
const {
    ObjectId
} = mongoose.Types

export const createEvent = async (params) => {
    const v = new Validator(params, {
        project: "required|string",
        instanceId: "required|string",
        serviceId: "required|string",
        title: "required|string",
        message: "required|string"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const instance = await instanceModel.findOne({
        project: new ObjectId(params?.project),
        slug: createSlug(params?.instanceId),
        service: new ObjectId(params?.serviceId)
    })

    if (!instance) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const raw = await eventModel.create({
        instance: instance._id,
        title: striptags(params?.title),
        message: striptags(params?.message),
    })

    return raw?.toJSON()
}

export const findEventById = async (id) => {

    const raw = await eventModel.findById(id)
    if (!raw) {
        return null
    }

    return raw?.toJSON()
}

const buildEventSearchQuery = (params) => {
    let query = {}

    if (params?.instance) {
        query.instance = new ObjectId(params?.instance)
    }

    return query
}

export const paginateEvent = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {

    let queryParams = buildEventSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)
    const sort = parseSortBy(sortBy)

    const aggregate = eventModel.aggregate([
        {
            $match: queryParams,
        },
        {
            $group: {
                _id: { title: "$title", message: "$message" },
                count: { $sum: 1 },
                lastCreatedAt: { $max: "$createdAt" }
            }
        },
        {
            $group: {
                _id: "$_id.title",
                messages: {
                    $push: {
                        message: "$_id.message",
                        total: "$count",
                        lastCreatedAt: "$lastCreatedAt"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                title: "$_id",
                messages: 1
            }
        },
        {
            $sort: {
                ...sort
            }
        }
    ])
    let options = { page, limit };

    let res = await eventModel.aggregatePaginate(aggregate, options);

    let list = {
        results: res?.docs?.map((n) => {
            return {
                id: n?._id?.toString(),
                title: n?.title,
                messages: n?.messages,
            }
        }),
        page,
        totalResults: res.total,
        totalPages: res.pages,
    };

    return list
}