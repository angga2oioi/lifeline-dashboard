//@ts-check

import { ACCOUNT_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createTokens, handleLogin, validateCookies } from "@/server/module/auth/auth.service";

export async function POST(request, { params }) {
    try {

        const cookieStore = await cookies()
        const body = await request.json();
        let account = await handleLogin(body)

        let { accessToken, refreshToken } = createTokens(account)
        // @ts-ignore
        cookieStore.set(ACCOUNT_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
        // @ts-ignore
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data: account
        });


    } catch (e) {
        console.log(e)
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

