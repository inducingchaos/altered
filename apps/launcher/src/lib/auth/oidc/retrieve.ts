/**
 *
 */

import { configureLogger } from "~/lib/observability"
import { createPKCEClient } from "./client"

const logger = configureLogger({ defaults: { scope: "oauth:retrieve" } })

export async function retrieveAccessToken() {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    logger.log({
        title: "Retrieved Access Token",
        data: {
            hasAccessToken: Boolean(tokenSet?.accessToken),
            hasRefreshToken: Boolean(tokenSet?.refreshToken),
            expiresIn: tokenSet?.expiresIn,
            isExpired: tokenSet?.isExpired ? tokenSet.isExpired() : "n/a"
        }
    })

    return tokenSet?.accessToken ?? null
}
