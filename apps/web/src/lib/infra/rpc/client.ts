/**
 *
 */

import { createOrpcErrorLogger } from "@altered/harness"
import type { Router } from "@altered-internal/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

declare global {
    var $client: RouterClient<Router> | undefined
}

const isServer = typeof window === "undefined"

const networkLink = new RPCLink({
    url: () => {
        if (isServer)
            throw new Error("RPCLink is not allowed on the server side.")

        return `${window.location.origin}/rpc`
    },
    interceptors: [
        onError(createOrpcErrorLogger({ enable: true, preset: "client" }))
    ]
})

function getClient(): RouterClient<Router> {
    if (isServer) {
        if (!globalThis.$client)
            throw new Error(
                "Server client not initialized. Ensure `client.server.ts` is imported first."
            )

        return globalThis.$client
    }
    return createORPCClient(networkLink)
}

/**
 * @remarks Workaround for issue: https://github.com/unnoq/orpc/issues/1346
 */
const clientProxy = new Proxy({} as RouterClient<Router>, {
    get(_, prop) {
        const client = getClient()

        return Reflect.get(client, prop, client)
    },

    has(_, prop) {
        return Reflect.has(getClient(), prop)
    },

    ownKeys() {
        return Reflect.ownKeys(getClient())
    },

    getOwnPropertyDescriptor(_, prop) {
        const client = getClient()

        const descriptor = Object.getOwnPropertyDescriptor(client, prop)
        if (descriptor) return { ...descriptor, configurable: true }

        return undefined
    }
})

const safeClient = createSafeClient(clientProxy)

export const api = createTanstackQueryUtils(safeClient)
