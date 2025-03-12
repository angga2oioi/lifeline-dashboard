//@ts-check

import { SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { validateProjectSignature } from "@/server/module/project/project.service";
import { createInstance, registerBeat, registerInstanceMetrics } from "@/server/module/instance/instance.service";

export async function POST(request, { params }) {
    try {

        const headers = Object.fromEntries(request.headers);

        const { searchParams } = new URL(request.nextUrl);
        const query = Object.fromEntries(searchParams.entries())
        const body = await request.json();

        const project = await validateProjectSignature(headers, body, query)
        const instance = await createInstance({
            ...body,
            project: project?.id
        })

        await registerBeat(instance?.id)

        if (body?.metrics) {
            registerInstanceMetrics({
                slug: instance?.slug,
                metrics: body?.metrics
            }).catch((e)=>console.error(e))
        }

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
