/**
 * @todo [P1] Move the proxy middleware utils to a separate module.
 */

import { trustedOrigins } from "@altered-internal/auth"
import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse, type ProxyConfig } from "next/server"

type ProxyMiddlewareHandler = (
    request: NextRequest
) => NextResponse | null | Promise<NextResponse | null>

type ProxyMiddlewareOptions = {
    config?: ProxyConfig
}

type MergeProxyConfigs = (prev: ProxyConfig, next: ProxyConfig) => ProxyConfig

type ComposeProxyOptions = {
    middleware: ReturnType<typeof createProxyMiddleware>[]

    /**
     * Customize the way middleware configurations are merged.
     */
    mergeConfigs?: MergeProxyConfigs
}

const mergeConfigs: MergeProxyConfigs = (prev, next) => ({
    ...prev,
    ...next,

    matcher: [...(prev.matcher || []), ...(next.matcher || [])]
})

/**
 * Creates a middleware instance that filters Next.js requests. Designed to be used in the "proxy.ts" file.
 *
 * @remarks Return `null` to continue, or a `NextResponse` to short-circuit.
 */
function createProxyMiddleware(
    handler: ProxyMiddlewareHandler,
    options?: ProxyMiddlewareOptions
) {
    return { handler, options }
}

/**
 * Composes multiple `createProxyMiddleware` instances to produce a single proxy handler and config object to export.
 */
function composeProxy(options: ComposeProxyOptions) {
    const proxy: ProxyMiddlewareHandler = async request => {
        for (const middleware of options.middleware) {
            const response = await middleware.handler(request)

            if (response) return response
        }

        return NextResponse.next()
    }

    let config: ProxyConfig = {}

    const handleMergeConfigs = options.mergeConfigs ?? mergeConfigs

    for (const middleware of options.middleware)
        if (middleware.options?.config)
            config = handleMergeConfigs(config, middleware.options.config)

    return { proxy, config }
}

/**
 * Configures CORS headers.
 *
 * @remarks Implemented to support cross-subdomain auth requests for the BetterAuth API routes. This shouldn't be necessary - adding trusted origins should automatically set these headers.
 *
 * @todo [P3] Decide if we should narrow our CORS restrictions. This should be fine for auth API routes, but if we widen the matcher we may want to reconsider.
 * @todo [P4] Allowed methods/headers *could* be refactored to a config somewhere.
 *
 * @see https://github.com/better-auth/better-auth/issues/4343
 */
const corsMiddleware = createProxyMiddleware(
    request => {
        const origin = request.headers.get("origin")

        const allowedMethods = [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ]

        const allowedHeaders = [
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "X-Requested-With",
            "Accept",
            "Accept-Version",
            "Content-Length",
            "Content-MD5",
            "Date",
            "X-Api-Version"
        ]

        const headers = new Headers({
            "Access-Control-Allow-Methods": allowedMethods.join(", "),
            "Access-Control-Allow-Headers": allowedHeaders.join(", "),
            "Access-Control-Allow-Credentials": "true"
        })

        if (origin && trustedOrigins.includes(origin))
            headers.set("Access-Control-Allow-Origin", origin)

        const responseWithHeaders = NextResponse.next()

        for (const [key, value] of headers.entries())
            responseWithHeaders.headers.set(key, value)

        return responseWithHeaders
    },
    { config: { matcher: ["/api/auth/:path*"] } }
)

/**
 * Adds route protection by checking for the presence of a session cookie.
 *
 * @remarks Not secure - this should only used as an optimistic check. Always handle auth checks per page/route.
 *
 * @todo [P3] Review and adjust redirect location.
 * @todo [P2] Update matcher to correctly match all protected routes.
 * @todo [P3] Update ignored segments to be more correct.
 */
const sessionMiddleware = createProxyMiddleware(
    request => {
        const ignoredRouteSegments = ["/api/auth"]
        const shouldIgnoreRoute = ignoredRouteSegments.some(segment =>
            request.nextUrl.pathname.startsWith(segment)
        )

        if (shouldIgnoreRoute) return null

        const hasSessionCookie = Boolean(getSessionCookie(request))

        if (!hasSessionCookie) {
            const redirectUrl = new URL("/", request.url)

            return NextResponse.redirect(redirectUrl)
        }

        return null
    },
    { config: { matcher: ["/app/:path*"] } }
)

export const { proxy, config } = composeProxy({
    middleware: [corsMiddleware, sessionMiddleware]
})
