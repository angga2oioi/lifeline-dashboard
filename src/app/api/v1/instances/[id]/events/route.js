//@ts-check

import {  NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";
import { amIAMember } from "@/server/module/project/project.service";
import { findInstanceById,  } from "@/server/module/instance/instance.service";
import { paginateEvent } from "@/server/module/event/event.service";

export async function GET(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const instance = await findInstanceById(params?.id)
        if (!instance) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const isMember = await amIAMember(account?.id, instance?.project?.toString())
        if (!isMember) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const { searchParams } = new URL(request.nextUrl);
        const {
            sortBy,
            limit,
            page
        } = Object.fromEntries(searchParams.entries())

        let data = await paginateEvent(
            { instance: params?.id }
            , sortBy, limit, page)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
