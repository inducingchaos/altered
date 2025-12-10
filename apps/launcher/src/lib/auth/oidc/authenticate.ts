/**
 *
 */

import { createPKCEClient } from "./client"
import { exchangeCodeForTokens } from "./exchange"
import { refreshTokens } from "./refresh"
import { requestAuthorizationCode } from "./request"

/**
 * Checks if our tokens are valid, refreshes them if needed, or initiates the full OAuth flow if there are no existing tokens. Returns the access token.
 */
export async function authenticateWithTokens(): Promise<string> {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    if (tokenSet?.accessToken) {
        if (tokenSet.refreshToken && tokenSet.isExpired()) {
            const refreshedTokens = await refreshTokens(tokenSet.refreshToken)

            await client.setTokens(refreshedTokens)
            return refreshedTokens.access_token
        }
        return tokenSet.accessToken
    }

    const { authorizationCode, authRequest } = await requestAuthorizationCode(client)
    const tokenResponse = await exchangeCodeForTokens(authRequest, authorizationCode)

    await client.setTokens(tokenResponse)

    return tokenResponse.access_token
}
