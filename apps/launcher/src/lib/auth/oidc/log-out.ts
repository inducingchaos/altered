/**
 *
 */

import { revokeTokens } from "./revoke"
import { createPKCEClient } from "./client"

export async function logOut() {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    if (tokenSet?.accessToken || tokenSet?.refreshToken) {
        try {
            const tokenTypeHint = tokenSet.accessToken ? "access_token" : "refresh_token"
            const token = tokenSet.accessToken ?? tokenSet.refreshToken

            await revokeTokens(token, tokenTypeHint)
        } catch (error) {
            console.error("Failed to revoke tokens:", error)
        }
    }

    await client.removeTokens()
}
