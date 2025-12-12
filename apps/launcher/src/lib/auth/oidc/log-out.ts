/**
 *
 */

import { logger } from "~/lib/observability"
import { createPKCEClient } from "./client"
import { revokeTokens } from "./revoke"

export async function logOut() {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    if (tokenSet?.accessToken || tokenSet?.refreshToken) {
        try {
            const tokenTypeHint = tokenSet.accessToken ? "access_token" : "refresh_token"
            const token = tokenSet.accessToken ?? tokenSet.refreshToken

            await revokeTokens(token, tokenTypeHint)
        } catch (error) {
            logger.error({ title: "Failed to Revoke Tokens", data: { error } })
        }
    }

    await client.removeTokens()

    logger.log({ title: "Logged Out" })
}
