/**
 *
 */

import "server-only"

import { createOrpcErrorLogger } from "@altered/harness"
import { extendHeaders } from "@altered/utils"
import { application } from "@altered-internal/config"
import { router } from "@altered-internal/harness"
import { createRouterClient, onError } from "@orpc/server"
import { headers } from "next/headers"

globalThis.$client = createRouterClient(router, {
    /**
     * Provide initial context if needed.
     *
     * Because this client instance is shared across all requests, only include context that's safe to reuse globally. For per-request context, use middleware context or pass a function as the initial context.
     */
    context: async () => ({
        request: {
            headers: extendHeaders(await headers(), {
                "x-client-version": application.env.api.clientVersion,
                "x-client-id": "altered-web"
            })
        }
    }),

    /**
     * @todo [P4] Wire up logging control to config.
     *
     * @remarks We may not need this since our oRPC router already logs errors on the server - we could remove either here or there. Leaving for now.
     */
    interceptors: [
        onError(createOrpcErrorLogger({ enable: true, preset: "server" }))
    ]
})
