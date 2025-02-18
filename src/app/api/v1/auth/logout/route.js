//@ts-check

import { ACCOUNT_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const cookieStore = await cookies()

        cookieStore().set(ACCOUNT_COOKIE_NAME, "", {
            path: "/",
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        cookieStore().set(REFRESH_TOKEN_COOKIE_NAME, "", {
            path: "/",
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
        });

    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
