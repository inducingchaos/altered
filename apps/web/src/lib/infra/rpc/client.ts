/**
 *
 */

import { Router } from "@altered-internal/harness"
import { createOrpcErrorLogger } from "@altered/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

declare global {
    var $client: RouterClient<Router> | undefined
}

const link = new RPCLink({
    url: () => {
        if (typeof window === "undefined") throw new Error("RPCLink is not allowed on the server side.")

        return `${window.location.origin}/rpc`
    },

    /**
     * @todo [P4] Wire up logging control to config.
     */
    interceptors: [onError(createOrpcErrorLogger({ enable: true, preset: "client" }))]
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
const client: RouterClient<Router> = globalThis.$client ?? createORPCClient(link)
const safeClient = createSafeClient(client)

export const api = createTanstackQueryUtils(safeClient)
