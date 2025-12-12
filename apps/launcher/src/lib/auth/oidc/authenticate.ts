/**
 *
 */

import { createLogger } from "~/lib/observability"
import { createPKCEClient } from "./client"
import { exchangeCodeForTokens } from "./exchange"
import { refreshTokens } from "./refresh"
import { requestAuthorizationCode } from "./request"
import { revokeTokens } from "./revoke"

const logger = createLogger({ defaults: { scope: "oauth:authorize" } })

/**
 * Checks if our tokens are valid, refreshes them if needed, or initiates the full OAuth flow if there are no existing tokens. Returns the access token.
 */
export async function authenticateWithTokens(): Promise<string> {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    logger.log({
        title: "Retrieved Stored Tokens",
        data: {
            hasAccessToken: Boolean(tokenSet?.accessToken),
            hasRefreshToken: Boolean(tokenSet?.refreshToken),
            expiresIn: tokenSet?.expiresIn,
            isExpired: tokenSet?.isExpired ? tokenSet.isExpired() : "n/a"
        }
    })

    if (tokenSet?.accessToken) {
        if (tokenSet.isExpired()) {
            if (tokenSet.refreshToken) {
                const refreshedTokens = await refreshTokens(tokenSet.refreshToken)
                await client.setTokens(refreshedTokens)

                logger.log({
                    title: "Refreshed and Stored Tokens",
                    data: {
                        expires_in: refreshedTokens.expires_in,
                        hasAccessToken: Boolean(refreshedTokens.access_token),
                        hasRefreshToken: Boolean(refreshedTokens.refresh_token)
                    }
                })

                return refreshedTokens.access_token
            }

            try {
                await revokeTokens(tokenSet.accessToken, "access_token")

                logger.log({ title: "Revoked Stale Token" })
            } catch (error) {
                logger.error({
                    title: "Failed to Revoke Token",
                    data: { error }
                })
            }
        } else {
            logger.log({ title: "Returning Existing Token" })

            return tokenSet.accessToken
        }
    }

    logger.log({ title: "Starting Authorization Flow..." })

    const { authorizationCode, authRequest } = await requestAuthorizationCode(client)

    const tokenResponse = await exchangeCodeForTokens(authRequest, authorizationCode)
    await client.setTokens(tokenResponse)

    logger.log({
        title: "Stored Initial Tokens",
        data: {
            expires_in: tokenResponse.expires_in,
            hasAccessToken: Boolean(tokenResponse.access_token),
            hasRefreshToken: Boolean(tokenResponse.refresh_token)
        }
    })

    return tokenResponse.access_token
}
