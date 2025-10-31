/**
 *
 */

import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    /**
     * Not secure: This is an optimistic redirect approach; handle auth checks per page/route.
     */
    if (!sessionCookie) return NextResponse.redirect(new URL("/", request.url))

    return NextResponse.next()
}

export const config = {
    /**
     * @todo [P2] Update to match protected routes.
     */
    matcher: ["/app/:path*"]
}
