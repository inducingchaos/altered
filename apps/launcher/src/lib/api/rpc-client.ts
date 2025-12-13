/**
 *
 */

import { createOrpcErrorLogger, type ContractRouterClient, type RouterContract } from "@altered/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { config } from "~/config"

type ClientContext = { authToken: string }

const link = new RPCLink<ClientContext>({
    url: config.rpcEndpoint,

    headers: async ({ context: { authToken } }) => ({ authorization: `Bearer ${authToken}` }),

    interceptors: [onError(createOrpcErrorLogger({ enable: true, preset: "client" }))]
})

export const client: ContractRouterClient<RouterContract, ClientContext> = createORPCClient(link)

export const api = createSafeClient(client)
export const queryApi = createTanstackQueryUtils(client)
