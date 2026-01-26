/**
 *
 */

import {
    type APIContract,
    type ContractRouterClient,
    createOrpcErrorLogger
} from "@altered/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { config } from "~/config"

export type ClientContext = {
    authToken?: string | null

    artificialDelay?: number
}

const link = new RPCLink<ClientContext>({
    url: config.rpcEndpoint,

    headers: ({ context: { authToken, artificialDelay } }) => {
        const headers: Record<string, string> = {}

        if (authToken) headers.authorization = `Bearer ${authToken}`

        headers["x-client-id"] = "altered-launcher"
        headers["x-client-version"] = config.appVersion

        const delay = artificialDelay ?? config.apiDelay
        if (delay) headers["x-artificial-delay"] = delay.toString()

        return headers
    },

    interceptors: [
        onError(createOrpcErrorLogger({ enable: true, preset: "client" }))
    ]
})

export const client: ContractRouterClient<APIContract, ClientContext> =
    createORPCClient(link)

export const api = createSafeClient(client)
