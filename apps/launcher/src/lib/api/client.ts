/**
 *
 */

import type { ContractRouterClient, RouterContract } from "@altered/harness"
import { createORPCClient, createSafeClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { config } from "~/config"
import { createPKCEClient } from "../auth/oidc/client"

async function getAccessToken() {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    if (!tokenSet?.accessToken) throw new Error("No access token found: `getAccessToken` must be called within an authenticated context.")

    return tokenSet.accessToken
}

const link = new RPCLink({
    url: `${config.baseUrl}/rpc`,

    headers: async () => ({ authorization: `Bearer ${await getAccessToken()}` }),

    interceptors: [
        onError(error => {
            console.error(error)
        })
    ]
})

const client: ContractRouterClient<RouterContract> = createORPCClient(link)

export const api = createSafeClient(client)
