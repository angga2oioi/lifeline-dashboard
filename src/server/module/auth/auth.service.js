//@ts-check

import { ACCOUNT_COOKIE_NAME, COOKIE_OPTIONS, CSRF_TOKEN_SECRET_COOKIE_NAME, INVALID_INPUT_ERR_CODE, MANAGE_ACCOUNT_ROLES, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE, REFRESH_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import jwt from "jsonwebtoken"
import { Validator } from "node-input-validator";
import accountModel from "../account/account.model";
import * as bcrypt from "bcryptjs"
import crypto from "crypto";

export const createTokens = (account) => {
    const accessToken = jwt.sign({ id: account.id, username: account?.username, roles: account?.roles }, process?.env?.ACCOUNT_TOKEN_JWT_SECRET, { expiresIn: 60 * 60 });
    const refreshToken = jwt.sign({ id: account.id, username: account?.username, roles: account?.roles }, process?.env?.REFRESH_TOKEN_JWT_SECRET, { expiresIn: 24 * 60 * 60 });

    return { accessToken, refreshToken };
};

const handleCookieRenewal = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process?.env?.REFRESH_TOKEN_JWT_SECRET);

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = createTokens(decoded);

        let account = jwt.verify(
            accessToken,
            process?.env?.ACCOUNT_TOKEN_JWT_SECRET
        );

        return { account, token: accessToken, refreshToken: newRefreshToken };
    } catch (err) {
        return {};
    }
}

export const setAuthCookies = (cookieStore, accessToken, refreshToken) => {
    // @ts-ignore
    cookieStore.set(ACCOUNT_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
    // @ts-ignore
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
}

export const validateCookies = async (cookies) => {
    let cookieStore = await cookies()

    let token = cookieStore.get(ACCOUNT_COOKIE_NAME)?.value
    let refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value
    if (!token || !refreshToken) {
        return {};
    }

    try {

        let account = jwt.verify(
            token,
            process?.env?.ACCOUNT_TOKEN_JWT_SECRET
        );

        return {
            account,
            token,
            refreshToken
        };
    } catch (e) {

        if (refreshToken) {
            let { account, token, refreshToken: newRefreshToken } = handleCookieRenewal(refreshToken)
            setAuthCookies(cookieStore, token, newRefreshToken)
            return {
                account,
                token,
                refreshToken: newRefreshToken
            }
        }

        return {};
    }
};

export const handleLogin = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        password: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const account = await accountModel.findOne({
        username: params?.username
    })

    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE);
    }

    const isPasswordMatch = bcrypt.compareSync(
        params?.password,
        account?.password
    );

    if (!isPasswordMatch) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE);
    }


    return account?.toJSON();
}

export const isSetupNeeded = async () => {
    const accounts = await accountModel.find({
        roles: MANAGE_ACCOUNT_ROLES
    })

    if (accounts?.length < 1) {
        return true
    }

    return false
}

export const validateCSRFToken = async (cookies, headers) => {
    let cookieStore = await cookies()
    let headStore = await headers()

    let csrfSecret = cookieStore.get(CSRF_TOKEN_SECRET_COOKIE_NAME)?.value
    let csrfHead = headStore.get("x-csrf-token")

    if (!csrfSecret || !csrfHead) {
        return false;
    }

    const expectedToken = crypto.createHmac('sha256', csrfSecret).digest('hex');


    if (expectedToken !== csrfHead) {
        return false
    }

    let newToken = Buffer.from(crypto.randomUUID()).toString("base64");
    //remove cookie when success to make subsequent request to reload the page to get new token
    cookieStore.set(CSRF_TOKEN_SECRET_COOKIE_NAME, "", {
        path: "/",
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    
    return true
}