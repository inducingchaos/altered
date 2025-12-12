/**
 *
 */

import { createOrpcErrorLogger, type ContractRouterClient, type RouterContract } from "@altered/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { config } from "~/config"
import { retrieveAccessToken } from "~/lib/auth/oidc"

const link = new RPCLink({
    url: config.rpcEndpoint,

    headers: async () => {
        const token = await retrieveAccessToken()

        return {
            authorization: token ? `Bearer ${token}` : undefined
        }
    },

    interceptors: [onError(createOrpcErrorLogger({ enable: true, preset: "client" }))]
})

const client: ContractRouterClient<RouterContract> = createORPCClient(link)
const safeClient = createSafeClient(client)

export const api = createTanstackQueryUtils(safeClient)
