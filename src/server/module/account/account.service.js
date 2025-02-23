//@ts-check

import { INVALID_INPUT_ERR_CODE, MANAGE_ACCOUNT_ROLES, MANAGE_PROJECT_ROLES, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, minMaxNum, parseSortBy } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import projectModel from "../project/project.model";
import accountModel from "./account.model";
import * as bcrypt from "bcryptjs";
import Randomstring from "randomstring";
import striptags from "striptags";
import projectAccountModel from "../project/project.account.model";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

export const setupAccount = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    // create new account
    const account = await createAccount({
        username: params?.username,
        roles: [
            MANAGE_ACCOUNT_ROLES,
            MANAGE_PROJECT_ROLES
        ]
    })

    // create new password for that account
    const password = await resetPassword(account?.id)

    // update the password with one that submitted
    await changePassword(account?.id, {
        oldpassword: password,
        newpassword: params?.password,
        repassword: params?.password,
    })

    return account
}

export const createAccount = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        roles: "arrayUnique",
        projects: "arrayUnique"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let projects = []
    if (params?.projects?.length > 0) {
        projects = (await Promise.all(params?.projects?.map((n) => {
            return projectModel.findById(n)
        })))?.filter((n) => {
            return n !== null
        })
    }

    let password = Randomstring.generate(12)
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        let account = await accountModel.create([
            {
                username: striptags(params?.username),
                roles: params?.roles,
                password: hash
            }
        ], { session })

        if (projects?.length > 0) {
            await projectAccountModel.create(projects?.map((n) => {
                return {
                    account: account?.[0]?._id,
                    project: n?._id
                }
            }), { ordered: true, session })

        }

        await session.commitTransaction()
        return account?.[0]?.toJSON()

    } catch (e) {
        await session.abortTransaction();
        throw e;
    }

}

export const resetPassword = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const newPassword = Randomstring.generate(6)

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(newPassword, salt);

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            password: hash
        }
    })

    return newPassword
}

export const changePassword = async (id, params) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const v = new Validator(params, {
        oldpassword: "required",
        newpassword: "required",
        repassword: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const isPasswordMatch = bcrypt.compareSync(
        params?.oldpassword,
        account?.password
    );

    if (!isPasswordMatch) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE);
    }

    if (params?.newpassword !== params?.repassword) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `password did not match`);
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(params?.newpassword, salt);

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            password: hash
        }
    })

    return null
}

export const patchAccountRole = async (id, roles) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            roles
        }
    })

    return null
}

export const removeAccount = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await accountModel.findByIdAndDelete(id)
    await projectAccountModel.deleteMany({
        account: new ObjectId(id)
    })

    return null
}

const buildAccountSearchQuery = (params) => {

    let query = {}

    if (params?.search) {
        query.username = {
            $regex: params?.search,
            $options: "i"
        }
    }

    if (params?.roles) {
        query.roles = {
            $in: params?.roles
        }
    }

    return query

}

export const paginateAccount = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {

    let queryParams = buildAccountSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    const sort = parseSortBy(sortBy)

    const aggregate = accountModel.aggregate([
        {
            $match: queryParams
        },
        {
            $lookup: {
                from: "projectaccounts",
                localField: "_id",
                foreignField: "account",
                as: "projects"
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "projects.project",
                foreignField: "_id",
                as: "projectDetails"
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                roles: 1,
                projects: {
                    $map: {
                        input: "$projectDetails",
                        as: "project",
                        in: {
                            id: "$$project._id",
                            name: "$$project.name"
                        }
                    }
                }
            }
        },
        {
            $sort: {
                ...sort
            }
        }
    ])

    let options = { page, limit };

    let res = await accountModel.aggregatePaginate(aggregate, options);

    let list = {
        results: res?.docs?.map((n) => {
            return {
                id: n?._id?.toString(),
                username: n?.username,
                roles: n?.roles,
                projects: n?.projects?.map((n) => {
                    return {
                        id: n?.id?.toString(),
                        name: n?.name
                    }
                }),
            }
        }),
        page,
        totalResults: res.total,
        totalPages: res.pages,
    };

    return list;
}

export const findAccountById = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    let r = account?.toJSON()
    delete r.password

    return r
}

export const canIManage = async (id, role) => {

    const account = await accountModel.findById(id)
    if (!account) {
        return false
    }

    if (account?.roles?.includes(role)) {
        return true
    }

    return false

}

export const getStatistic = async (id) => {

    const result = await projectAccountModel.aggregate([
        {
            $match: {
                account: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "services",
                localField: "project",
                foreignField: "project",
                as: "services"
            }
        },
        {
            $lookup: {
                from: "instances",
                localField: "project",
                foreignField: "project",
                as: "instances"
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
                _id: "$account",
                totalProjects: { $addToSet: "$project" },
                totalServices: { $push: "$services" },
                totalInstances: { $push: "$instances" },
                totalEvents: { $push: "$events" }
            }
        },
        {
            $project: {
                accountId: "$_id",
                totalProjects: {
                    $ifNull: [{ $size: { $ifNull: ["$totalProjects", []] } }, 0]
                },
                totalServices: {
                    $ifNull: [
                        {
                            $size: {
                                $reduce: {
                                    input: "$totalServices",
                                    initialValue: [],
                                    in: { $concatArrays: ["$$value", "$$this"] }
                                }
                            }
                        },
                        0
                    ]
                },
                totalInstances: {
                    $ifNull: [
                        {
                            $size: {
                                $reduce: {
                                    input: "$totalInstances",
                                    initialValue: [],
                                    in: { $concatArrays: ["$$value", "$$this"] }
                                }
                            }
                        },
                        0
                    ]
                },
                totalEvents: {
                    $ifNull: [
                        {
                            $size: {
                                $reduce: {
                                    input: "$totalEvents",
                                    initialValue: [],
                                    in: { $concatArrays: ["$$value", "$$this"] }
                                }
                            }
                        },
                        0
                    ]
                }
            }
        }
    ])


    return result?.[0] || null

}