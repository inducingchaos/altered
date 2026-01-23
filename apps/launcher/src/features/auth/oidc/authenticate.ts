/**
 *
 */

import { configureLogger } from "~/observability"
import { createPKCEClient } from "./client"
import { exchangeCodeForTokens } from "./exchange"
import { refreshTokens } from "./refresh"
import { requestAuthorizationCode } from "./request"
import { revokeTokens } from "./revoke"

const logger = configureLogger({ defaults: { scope: "oauth:authorize" } })

/**
 * A promise mutex to prevent duplicate token refresh attempts.
 */
let refreshPromise: Promise<string> | null = null

/**
 * Checks if our tokens are valid, refreshes them if needed, or initiates the full OAuth flow if there are no existing tokens. Returns the access token.
 *
 * @todo [P3] Evaluate if switching entirely to use the Better Auth Generic OAuth plugin would be viable and more robust.
 *
 * @todo [P2] We need to revoke stale tokens when we refresh them.
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
                if (refreshPromise) {
                    logger.log({ title: "Waiting for Concurrent Refresh" })

                    return await refreshPromise
                }

                const refreshToken = tokenSet.refreshToken

                refreshPromise = (async () => {
                    try {
                        const result = await refreshTokens(refreshToken)

                        if (!result.success) {
                            if (result.reason === "expired") {
                                logger.log({
                                    title: "Refresh Token Expired - Clearing Tokens"
                                })

                                await client.removeTokens()

                                const { authorizationCode, authRequest } =
                                    await requestAuthorizationCode(client)

                                const tokenResponse =
                                    await exchangeCodeForTokens(
                                        authRequest,
                                        authorizationCode
                                    )

                                await client.setTokens(tokenResponse)

                                logger.log({
                                    title: "Re-authenticated After Refresh Token Expiry",
                                    data: {
                                        expires_in: tokenResponse.expires_in,
                                        hasAccessToken: Boolean(
                                            tokenResponse.access_token
                                        ),
                                        hasRefreshToken: Boolean(
                                            tokenResponse.refresh_token
                                        )
                                    }
                                })

                                return tokenResponse.access_token
                            }

                            throw new Error(
                                "Failed to refresh tokens - unknown error."
                            )
                        }

                        await client.setTokens(result.tokens)

                        logger.log({
                            title: "Refreshed and Stored Tokens",
                            data: {
                                expires_in: result.tokens.expires_in,
                                hasAccessToken: Boolean(
                                    result.tokens.access_token
                                ),
                                hasRefreshToken: Boolean(
                                    result.tokens.refresh_token
                                )
                            }
                        })

                        return result.tokens.access_token
                    } finally {
                        refreshPromise = null
                    }
                })()

                return await refreshPromise
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

    const { authorizationCode, authRequest } =
        await requestAuthorizationCode(client)

    const tokenResponse = await exchangeCodeForTokens(
        authRequest,
        authorizationCode
    )
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
