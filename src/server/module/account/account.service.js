//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, minMaxNum } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import projectModel from "../project/project.model";
import accountModel from "./account.model";
import * as bcrypt from "bcryptjs";
import Randomstring from "randomstring";
import striptags from "striptags";
import projectAccountModel from "../project/project.account.model";
import mongoose from "mongoose";

export const createAccount = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        roles: "required|arrayUnique",
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
            }), { session })

        }

        await session.commitTransaction()
        return account?.[0]?.toJSON()

    } catch (e) {
        await session.abortTransaction();
        throw e;
    }

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

    let querySearch = buildAccountSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    let list = await accountModel.paginate(querySearch, { sortBy, limit, page })
    list.results = list?.results?.map((n) => {
        let r = n?.toJSON()
        delete r.password
        return r
    })

    return list

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