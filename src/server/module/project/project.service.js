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
        accounts: "require|string"
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
                username: striptags(params?.username),
                credential
            }
        ], { session })

        if (accounts?.length > 0) {
            await projectAccountModel.create(accounts?.map((n) => {
                return {
                    account: n._id,
                    project: project?.[0]?._id
                }
            }), { session })

        }

        await session.commitTransaction()
        return {
            id: project?.[0]?._id?.toString(),
            secret: secretKey
        }

    } catch (e) {
        await session.abortTransaction();
        throw e;
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

const buildProjectSearchQuery = (params) => {
    let projectQuery = {}
    let accountQuery = {}
    if (params?.search) {
        projectQuery.$or = [
            { title: { $regex: params?.search, $options: "i" } }, // Filter by project title (case-insensitive)
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

export const paginateProject = async (query, sortBy, limit, page) => {
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

    let options = { page, limit };

    let res = await projectModel.aggregatePaginate(aggregate, options);

    let list = {
        results: res?.docs?.map((n) => {
            return {
                id: n?._id?.toString(),
                name: n?.name,
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

    return null

}

export const validateProjectSignature = async (headers, body = {}, query = {}) => {
    const { projectid, timestamp, signature } = headers;

    const project = await projectModel.findById(projectid)
    if (!project) {
        throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
    }

    const { secretKey } = decryptKey(project?.credential)

    let nowTime = new Date().getTime();

    let timeDiff = Math.abs(nowTime - num2Int(timestamp));
    if (timeDiff > 5 * 60 * 1000) {
        throw HttpError(NO_ACCESS_ERR_CODE, `Request expired`);
    }

    let params = JSON.stringify({
        ...query,
        ...body,
    });

    const Hash = params + num2Int(timestamp);

    const Signature = crypto
        .createHmac(`SHA256`, secretKey)
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
        project: new ObjectId(projectId),
        account: new ObjectId(accountId)
    })

    if (!raw) {
        return false
    }

    return true

}