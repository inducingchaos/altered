/**
 *
 */

import { createTRPCClient, httpBatchLink, loggerLink, TRPCClient } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"

import type { AppRouter } from "@altered/api"

import config from "../../../config"
import { baseUrl } from "../../environment"
import { queryClient } from "../client"
import { customTRPCLogger } from "./logger"

/**
 * @todo [P2] Set up auth.
 */
export const trpcClient: TRPCClient<AppRouter> = createTRPCClient({
    links: [
        loggerLink({
            enabled: opts =>
                process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
            colorMode: "css",
            logger: customTRPCLogger
        }),
        httpBatchLink({
            transformer: superjson,
            url: `${baseUrl}${config.paths.api.endpoints.trpc}`,
            headers() {
                const headers = new Map<string, string>()
                headers.set("x-trpc-source", "raycast-react")

                //   const cookies = authClient.getCookie();
                //   if (cookies) headers.set("Cookie", cookies);

                return Object.fromEntries(headers)
            }
        })
    ]
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient
})

export { type RouterInputs, type RouterOutputs } from "@altered/api"
