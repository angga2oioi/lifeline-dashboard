//@ts-check

import { MANAGE_PROJECT_ROLES, NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";
import { canIManage } from "@/server/module/account/account.service";
import { amIAMember, findProjectById, removeProject } from "@/server/module/project/project.service";
import { createService, listService, paginateService } from "@/server/module/service/service.service";

export async function POST(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const canManage = await canIManage(account?.id, MANAGE_PROJECT_ROLES)
        if (!canManage) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }
        const query = await params

        const isMember = await amIAMember(account?.id, query?.id)
        if (!isMember) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const body = await request.json();

        let data = await createService({
            ...body,
            project: query?.id
        })

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}

export async function GET(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const query = await params

        const isMember = await amIAMember(account?.id, query?.id)
        if (!isMember) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }


        let data = await listService({ project: query?.id })

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
