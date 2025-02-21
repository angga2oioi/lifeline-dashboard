//@ts-check

import { ACCOUNT_COOKIE_NAME, COOKIE_OPTIONS, CSRF_TOKEN_COOKIE_NAME, MANAGE_ACCOUNT_ROLES, MANAGE_PROJECT_ROLES, NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, REFRESH_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createTokens, handleLogin, isSetupNeeded, validateCSRFToken } from "@/server/module/auth/auth.service";
import { changePassword, createAccount, resetPassword, setupAccount } from "@/server/module/account/account.service";

export async function POST(request, { params }) {
    try {

        // check if we need setup account
        const isNeeded = await isSetupNeeded()
        if (!isNeeded) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const isCsrfValid = await validateCSRFToken(cookies,headers)
        if (!isCsrfValid) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const body = await request.json();

        await setupAccount(body)

        const cookieStore = await cookies()

        let account = await handleLogin(body)

        let { accessToken, refreshToken } = createTokens(account)
        // @ts-ignore
        cookieStore.set(ACCOUNT_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
        // @ts-ignore
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

