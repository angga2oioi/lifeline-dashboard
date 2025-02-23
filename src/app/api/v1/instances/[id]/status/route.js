//@ts-check

import { NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";
import { amIAMember } from "@/server/module/project/project.service";
import { findInstanceById, getInstanceStatuses, listInstance, } from "@/server/module/instance/instance.service";

export async function GET(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const query = await params

        const instance = await findInstanceById(query?.id)
        if (!instance) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const isMember = await amIAMember(account?.id, instance?.project?.toString())
        if (!isMember) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        let data = await getInstanceStatuses(query?.id)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
