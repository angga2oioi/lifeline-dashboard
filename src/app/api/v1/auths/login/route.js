//@ts-check

import { NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createTokens, handleLogin, setAuthCookies, validateCookies, validateCSRFToken } from "@/server/module/auth/auth.service";

export async function POST(request, { params }) {
    try {

        const cookieStore = await cookies()

        const isCsrfValid = await validateCSRFToken(cookies, headers)
        if (!isCsrfValid) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const body = await request.json();
        let account = await handleLogin(body)

        let { accessToken, refreshToken } = createTokens(account)

        setAuthCookies(cookieStore, accessToken, refreshToken)
        delete account.password

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data: account
        });


    } catch (e) {

        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

