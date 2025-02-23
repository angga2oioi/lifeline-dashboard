//@ts-check

import { MANAGE_ACCOUNT_ROLES, NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";
import { canIManage, createAccount, paginateAccount } from "@/server/module/account/account.service";

export async function GET(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const canManage = await canIManage(account?.id, MANAGE_ACCOUNT_ROLES)
        if (!canManage) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const { searchParams } = new URL(request.nextUrl);

        let {
            search,
            sortBy,
            limit,
            page
        } = Object.fromEntries(searchParams.entries())

        let data = await paginateAccount({ search }, sortBy, limit, page)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

export async function POST(request, { params }) {
    try {

        const body = await request.json();
        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const canManage = await canIManage(account?.id, MANAGE_ACCOUNT_ROLES)
        if (!canManage) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        
        let data = await createAccount(body)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
