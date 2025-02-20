//@ts-check

import { ACCOUNT_COOKIE_NAME, COOKIE_OPTIONS, INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE, REFRESH_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import jwt from "jsonwebtoken"
import { Validator } from "node-input-validator";
import accountModel from "../account/account.model";
import * as bcrypt from "bcryptjs"

export const createTokens = (account) => {
    const accessToken = jwt.sign({ id: account.id, username: account?.username, roles: account?.roles }, process?.env?.ACCOUNT_TOKEN_JWT_SECRET, { expiresIn: 60 * 60 });
    const refreshToken = jwt.sign({ id: account.id, username: account?.username, roles: account?.roles }, process?.env?.REFRESH_TOKEN_JWT_SECRET, { expiresIn: 24 * 60 * 60 });

    return { accessToken, refreshToken };
};

export const setAuthCookies = (cookies, accessToken, refreshToken) => {
    cookies.set(ACCOUNT_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
    cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    return null
};

const handleCookieRenewal = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process?.env?.REFRESH_TOKEN_JWT_SECRET);

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = createTokens(decoded);

        let account = jwt.verify(
            accessToken,
            process?.env?.ACCOUNT_AUTHENTICATION_JWT_SECRET
        );

        return { account, token: accessToken, refreshToken: newRefreshToken };
    } catch (err) {
        return {};
    }
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
            process?.env?.ACCOUNT_AUTHENTICATION_JWT_SECRET
        );

        return {
            account,
            token,
        };
    } catch (e) {
        if (refreshToken) {
            let { account, token, refreshToken: newRefreshToken } = handleCookieRenewal(refreshToken)
            setAuthCookies(cookieStore, token, newRefreshToken);
            return {
                account,
                token
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