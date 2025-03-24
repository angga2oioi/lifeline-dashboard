//@ts-check

import { NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE } from "@/global/utils/constant";

import { HttpError } from "@/global/utils/functions";

import { CSRF_TOKEN_SECRET_COOKIE_NAME } from "@/global/utils/constant";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { parseError } from "@/global/utils/functions";

export async function GET(request, { params }) {
    try {

        const cookieStore = await cookies()
        const csrfSecret = cookieStore.get(CSRF_TOKEN_SECRET_COOKIE_NAME)?.value;
        if (!csrfSecret) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const csrfToken = crypto.createHmac('sha256', csrfSecret).digest('hex');
        return NextResponse.json({ csrfToken });

    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

