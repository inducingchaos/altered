/**
 * @todo [P1] Move the proxy middleware utils to a separate module.
 */

import { trustedOrigins } from "@altered-internal/auth"
import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse, type ProxyConfig } from "next/server"

type ProxyMiddlewareHandler = (
    request: NextRequest
) => NextResponse | null | Promise<NextResponse | null>

type ProxyMiddlewareOptions<Config extends ProxyConfig = ProxyConfig> = {
    config?: Config
}

type ProxyMiddleware<Config extends ProxyConfig = ProxyConfig> = {
    handler: ProxyMiddlewareHandler
    options?: ProxyMiddlewareOptions<Config>
}

type ExtractConfig<Middleware> =
    Middleware extends ProxyMiddleware<infer Config> ? Config : never

type MergeMatchers<Middleware extends readonly ProxyMiddleware[]> =
    Middleware extends readonly [
        infer FirstMiddleware extends ProxyMiddleware,
        ...infer RestMiddleware extends ProxyMiddleware[]
    ]
        ? [
              ...(ExtractConfig<FirstMiddleware> extends {
                  matcher: infer Matcher extends readonly unknown[]
              }
                  ? Matcher
                  : []),
              ...MergeMatchers<RestMiddleware>
          ]
        : []

type TupleToUnion<Tuple extends readonly unknown[]> = Tuple[number]

type MergeConfigsType<Middleware extends readonly ProxyMiddleware[]> = {
    matcher: readonly TupleToUnion<MergeMatchers<Middleware>>[]
}

type ComposeProxyOptions<Middleware extends readonly ProxyMiddleware[]> = {
    middleware: Middleware

    /**
     * Customize the way middleware configurations are merged.
     */
    mergeConfigs?: (prev: ProxyConfig, next: ProxyConfig) => ProxyConfig
}

const mergeConfigs = (prev: ProxyConfig, next: ProxyConfig): ProxyConfig => ({
    ...prev,
    ...next,

    matcher: [...(prev.matcher || []), ...(next.matcher || [])]
})

/**
 * Creates a middleware instance that filters Next.js requests. Designed to be used in the "proxy.ts" file.
 *
 * @remarks Return `null` to continue, or a `NextResponse` to short-circuit.
 */
function createProxyMiddleware<const Options extends ProxyMiddlewareOptions>(
    handler: ProxyMiddlewareHandler,
    options?: Options
) {
    type InferredConfig =
        Options extends ProxyMiddlewareOptions<infer Config>
            ? Config
            : ProxyConfig

    return { handler, options } as ProxyMiddleware<InferredConfig>
}

/**
 * Composes multiple `createProxyMiddleware` instances to produce a single proxy handler and config object to export.
 */
function composeProxy<const Middleware extends readonly ProxyMiddleware[]>(
    options: ComposeProxyOptions<Middleware>
) {
    const proxy: ProxyMiddlewareHandler = async request => {
        for (const middleware of options.middleware) {
            const response = await middleware.handler(request)

            if (response) return response
        }

        return NextResponse.next()
    }

    let config: ProxyConfig = {}

    const merge = options.mergeConfigs ?? mergeConfigs

    for (const middleware of options.middleware)
        if (middleware.options?.config)
            config = merge(config, middleware.options.config)

    return {
        proxy,

        /**
         * Since the Next.js proxy config is required to be a static object, this is best used in a `satisfies` check on the config object to ensure consistency across multiple middleware.
         */
        config: config as unknown as MergeConfigsType<Middleware>
    }
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

export const comp = composeProxy({
    middleware: [corsMiddleware, sessionMiddleware]
})

/**
 * @remarks Compiler can't detect deconstructed exports from `composeProxy` so this is needed.
 */
export const proxy = comp.proxy

/**
 * @remarks The proxy config must be a static object, so we redefine it and use a satisfies check to maintain consistency.
 */
export const config = {
    matcher: ["/app/:path*", "/api/auth/:path*"]
} satisfies typeof comp.config
