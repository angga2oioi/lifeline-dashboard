import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers"
import { COOKIE_OPTIONS, CSRF_TOKEN_SECRET_COOKIE_NAME } from "./global/utils/constant";

export async function middleware(request) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");


    const devEval =
        process.env.NODE_ENV === "development" ? `'unsafe-eval'` : "";
    const devInline = `'unsafe-inline'`;

    const cspHeader = `
    default-src 'strict-dynamic' 'nonce-${nonce}' ${devEval};
    script-src 'strict-dynamic' 'nonce-${nonce}' ${devEval};
    style-src 'self'  ${devInline};
    font-src 'self';
    connect-src 'self' data: ;
    frame-src 'self' blob: ;
    img-src 'self' blob: data: ;
    media-src 'self' blob: data: ;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'self' blob: data: ;`;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    const requestHeaders = new Headers(request.headers);
    // ❌ Remove the vulnerable header
    requestHeaders.delete("x-middleware-subrequest");

    // Setting request headers
    requestHeaders.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue
    );

    let head = await headers();
    let cookieStore = await cookies()
    let csrfCookie = cookieStore.get(CSRF_TOKEN_SECRET_COOKIE_NAME)?.value
    if (!csrfCookie) {
        csrfCookie = Buffer.from(crypto.randomUUID()).toString("base64");
        cookieStore.set(CSRF_TOKEN_SECRET_COOKIE_NAME, csrfCookie, COOKIE_OPTIONS);
    }

    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("x-frame-options", "DENY");
    requestHeaders.set("x-content-type-options", "nosniff");
    requestHeaders.set(
        "Access-Control-Allow-Origin",
        head.get("host")
    );

    const response = NextResponse.next({
        headers: requestHeaders,
        request: {
            headers: requestHeaders,
        },
    });

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: "/((?!_next/static|api|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
