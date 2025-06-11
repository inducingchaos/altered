/**
 *
 */

import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"

import type { AppRouter } from "@altered-42/api"

import { customTRPCLogger } from "./custom-logger"
import { getBaseUrl } from "./get-base-url"
import { queryClient } from "./query-client"

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: createTRPCClient({
        links: [
            loggerLink({
                enabled: opts =>
                    process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
                colorMode: "css",
                logger: customTRPCLogger
            }),
            httpBatchLink({
                transformer: superjson,
                url: `${getBaseUrl()}/api/trpc`,
                headers() {
                    const headers = new Map<string, string>()
                    headers.set("x-trpc-source", "raycast-react")

                    //   const cookies = authClient.getCookie();
                    //   if (cookies) headers.set("Cookie", cookies);

                    return Object.fromEntries(headers)
                }
            })
        ]
    }),
    queryClient
})

export { type RouterInputs, type RouterOutputs } from "@altered-42/api"
