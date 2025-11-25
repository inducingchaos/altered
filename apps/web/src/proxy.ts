/**
 *
 */

import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    //  REMARK: Not secure. This should only be an optimistic check. Always handle auth checks per page/route.
    //  TODO [P3]: Change redirect location.
    if (!sessionCookie) return NextResponse.redirect(new URL("/", request.url))

    return NextResponse.next()
}

export const config = {
    /**
     * @todo [P2] Update to match protected routes.
     */
    matcher: ["/app/:path*"]
}
