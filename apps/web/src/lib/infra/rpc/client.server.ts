/**
 *
 */

import "server-only"

import { router } from "@altered-internal/harness"
import { createRouterClient } from "@orpc/server"
import { headers } from "next/headers"

globalThis.$client = createRouterClient(router, {
    /**
     * Provide initial context if needed.
     *
     * Because this client instance is shared across all requests, only include context that's safe to reuse globally. For per-request context, use middleware context or pass a function as the initial context.
     */
    context: async () => ({
        _: {
            headers: await headers()
        }
    })
})
