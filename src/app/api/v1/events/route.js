//@ts-check

import { SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { validateProjectSignature } from "@/server/module/project/project.service";
import { createEvent } from "@/server/module/event/event.service";

export async function POST(request, { params }) {
    try {

        const headers = Object.fromEntries(request.headers);

        const { searchParams } = new URL(request.nextUrl);
        const query = Object.fromEntries(searchParams.entries())
        const body = await request.json();

        const project = await validateProjectSignature(headers, body, query)
        const event = await createEvent({
            ...body,
            project: project?.id
        })

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data:event
        });


    } catch (e) {
        console.error(e)
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
