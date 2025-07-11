/**
 *
 */

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        //  Since we have a basic sign-in button on our home page, we will pass the callback URL to there. Once we have a dedicated sign-in page, we can move this there instead.

        const callbackPathname = request.nextUrl.pathname
        const callbackSearchParams = request.nextUrl.searchParams
        const callbackUrl = `${callbackPathname}?${callbackSearchParams.toString()}`

        const signInUrl = new URL("/", request.url)
        signInUrl.searchParams.set("callback-url", callbackUrl)

        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/raycast"]
}
