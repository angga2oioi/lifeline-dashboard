//@ts-check

import { Validator } from "node-input-validator"
import projectModel from "./project.model"
import { HttpError, minMaxNum, num2Int, parseSortBy } from "@/global/utils/functions"
import { INVALID_INPUT_ERR_CODE, NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant"
import accountModel from "../account/account.model"
import striptags from "striptags"
import crypto from "crypto"
import projectAccountModel from "./project.account.model"
import mongoose from "mongoose"
const algorithm = "aes-256-ctr";
const secretKey = process?.env?.CRYPTO_SECRET;
import Randomstring from "randomstring"
import serviceModel from "../service/service.model"
import instanceModel from "../instance/instance.model"
import instanceBeatModel from "../instance/instance.beat.model"
import eventModel from "../event/event.model"
const {
    ObjectId
} = mongoose.Types

export const findProjectbyId = async (id) => {

    let raw = await projectModel.findById(id)

    return raw?.toJSON()

}

const encryptKey = (text) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    };
};

const decryptKey = (hash) => {
    if (!hash?.iv || !hash?.content) {
        return hash;
    }

    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(hash.iv, "hex")
    );

    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.content, "hex")),
        decipher.final(),
    ]);

    return JSON.parse(decrpyted.toString());
};

export const createProject = async (params) => {
    const v = new Validator(params, {
        name: "required|string",
        accounts: "required|arrayUnique"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let accounts = []

    if (params?.accounts?.length > 0) {
        accounts = (await Promise.all(params?.accounts?.map((n) => {
            return accountModel.findById(n)
        })))?.filter((n) => {
            return n !== null
        })
    }

    let secretKey = Randomstring.generate(12)
    let credential = encryptKey(JSON.stringify({ secretKey }))

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        let project = await projectModel.create([
            {
                name: striptags(params?.name),
                credential
            }
        ], { session })

        if (accounts?.length > 0) {
            await projectAccountModel.create(accounts?.map((n) => {
                return {
                    account: n._id,
                    project: project?.[0]?._id
                }
            }), { ordered: true, session })

        }

        await session.commitTransaction()
        return {
            id: project?.[0]?._id?.toString(),
            secret: secretKey
        }

    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }

}

export const findProjectById = async (id) => {

    let raw = await projectModel.findById(id)
    if (!id) {
        return null
    }

    const r = raw?.toJSON()
    delete r.credential
    return r

}

export const updateProject = async (id, params) => {
    const project = await projectModel.findById(id)
    if (!project) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const v = new Validator(params, {
        name: "required|string",
        accounts: "required|arrayUnique"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let accounts = []

    if (params?.accounts?.length > 0) {
        accounts = (await Promise.all(params?.accounts?.map((n) => {
            return accountModel.findById(n)
        })))?.filter((n) => {
            return n !== null
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        await projectModel.findByIdAndUpdate(id, {
            $set: {
                name: striptags(params?.name),
            }
        }, { session })

        if (accounts?.length > 0) {
            await projectAccountModel.deleteMany({
                project: new ObjectId(id)
            }, { session })

            await projectAccountModel.create(accounts?.map((n) => {
                return {
                    account: n._id,
                    project: new ObjectId(id)
                }
            }), { ordered: true, session })

        }

        await session.commitTransaction()
        return null

    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }


}

const buildProjectSearchQuery = (params) => {
    let projectQuery = {}
    let accountQuery = {}
    if (params?.search) {
        projectQuery.$or = [
            { name: { $regex: params?.search, $options: "i" } }, // Filter by project title (case-insensitive)
        ]
    }

    if (params?.account) {
        accountQuery["accounts.account"] = new ObjectId(params?.account)
    }

    return {
        projectQuery,
        accountQuery
    }
}

export const paginateProject = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {
    let {
        accountQuery,
        projectQuery
    } = buildProjectSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    const sort = parseSortBy(sortBy)

    const aggregate = projectModel.aggregate([
        {
            $match: projectQuery
        },
        {
            $lookup: {
                from: "projectaccounts",
                localField: "_id",
                foreignField: "project",
                as: "accounts"
            }
        },
        {
            $match: accountQuery
        },
        {
            $lookup: {
                from: "accounts",
                localField: "accounts.account",
                foreignField: "_id",
                as: "accountDetails"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                createdAt: 1,
                accounts: {
                    $map: {
                        input: "$accountDetails",
                        as: "account",
                        in: {
                            id: "$$account._id",
                            username: "$$account.username"
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "services",
                localField: "_id",
                foreignField: "project",
                as: "services"
            }
        },
        {
            $lookup: {
                from: "instances",
                localField: "_id",
                foreignField: "project",
                as: "instances"
            }
        },
        {
            $unwind: {
                path: "$instances",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "instances._id",
                foreignField: "instance",
                as: "events"
            }
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                accounts: { $first: "$accounts" },
                services: { $first: "$services" },
                instances: { $push: "$instances" },
                events: { $push: "$events" },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                accounts: 1,
                totalServices: { $size: "$services" },
                totalInstances: { $size: "$instances" },
                totalEvents: {
                    $size: {
                        $reduce: {
                            input: "$events",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    }
                },
                createdAt: 1
            }
        },
        {
            $sort: {
                ...sort
            }
        }
    ])

    let options = { page, limit };

    let res = await projectModel.aggregatePaginate(aggregate, options);

    let list = {
        results: res?.docs?.map((n) => {
            return {
                id: n?._id?.toString(),
                name: n?.name,
                accounts: n?.accounts,
                totalServices: n?.totalServices,
                totalInstances: n?.totalInstances,
                totalEvents: n?.totalEvents,
                createdAt: n?.createdAt,
            }
        }),
        page,
        totalResults: res.total,
        totalPages: res.pages,
    };

    return list

}

export const listProject = async (query, sortBy, limit, page) => {
    let {
        accountQuery,
        projectQuery
    } = buildProjectSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    const sort = parseSortBy(sortBy)

    const aggregate = await projectModel.aggregate([
        {
            $match: projectQuery
        },
        {
            $lookup: {
                from: "projectaccounts",
                localField: "_id",
                foreignField: "project",
                as: "accounts"
            }
        },
        {
            $match: accountQuery
        },
        {
            $project: {
                _id: 1,
                name: 1,
                createdAt: 1,
                accounts: 0
            }
        },
        {
            $sort: {
                ...sort
            }
        }
    ])

    let list = aggregate?.map((n) => {
        return {
            id: n?._id?.toString(),
            name: n?.name,
            createdAt: n?.createdAt,
        }
    })

    return list

}

export const removeProject = async (id) => {

    let raw = await projectModel.findById(id)
    if (!id) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await projectModel.findByIdAndDelete(id)
    await projectAccountModel.deleteMany({
        project: raw?._id
    })
    await serviceModel.deleteMany({
        project: raw?._id
    })

    let instances = await instanceModel.find({
        project: raw?._id
    })

    await instanceModel.deleteMany({
        project: raw?._id
    })

    await instanceBeatModel.deleteMany({
        instance: {
            $in: instances?.map((n) => {
                return n?._id
            })
        }
    })

    await eventModel.deleteMany({
        instance: {
            $in: instances?.map((n) => {
                return n?._id
            })
        }
    })

    return null

}

export const validateProjectSignature = async (headers, body = {}, query = {}) => {
    const { projectid, timestamp, signature } = headers;
    if (!projectid || !timestamp || !signature) {
        throw HttpError(NO_ACCESS_ERR_CODE, `Missing headers`);
    }

    const project = await projectModel.findById(projectid)
    if (!project) {
        throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
    }

    const { secretKey } = decryptKey(project?.credential)

    let nowTime = new Date().getTime();
    const parsedTimestamp = num2Int(timestamp);
    if (parsedTimestamp > nowTime) {
        throw HttpError(NO_ACCESS_ERR_CODE, `Time travelling is currently impossible`);
    }
    
    let timeDiff = Math.abs(nowTime - parsedTimestamp);
    if (timeDiff > 5 * 60 * 1000) {
        throw HttpError(NO_ACCESS_ERR_CODE, `Request expired`);
    }

    let params = JSON.stringify({
        ...query,
        ...body,
    });

    const Hash = params + num2Int(timestamp);

    const Signature = crypto
        .createHmac(`sha256`, secretKey)
        .update(Hash)
        .digest("hex")
        .toUpperCase();

    if (Signature !== signature) {
        throw HttpError(NO_ACCESS_ERR_CODE, `Invalid signature`);
    }

    return project?.toJSON();
};

export const amIAMember = async (accountId, projectId) => {

    const raw = await projectAccountModel.findOne({
        project: new ObjectId(projectId?.toString()),
        account: new ObjectId(accountId?.toString())
    })

    if (!raw) {
        return false
    }

    return true

}