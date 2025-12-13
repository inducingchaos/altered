/**
 * @todo [P4] Implement more complex logging and error handling.
 */

import { OAuth } from "@raycast/api"
import { config } from "~/config"
import { configureLogger } from "~/lib/observability"

const logger = configureLogger({ defaults: { scope: "oauth:refresh" } })

/**
 * Refreshes the access token using the refresh token.
 */
export async function refreshTokens(refreshToken: string): Promise<OAuth.TokenResponse> {
    const params = new URLSearchParams()

    params.append("client_id", config.oauthClientId)
    params.append("refresh_token", refreshToken)
    params.append("grant_type", "refresh_token")

    const response = await fetch(config.oauthTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })

    if (!response.ok) {
        const errorText = await response.text()

        logger.error({
            title: "Failed to Refresh Tokens",
            data: { status: response.status, statusText: response.statusText, body: errorText }
        })

        throw new Error(`Failed to refresh tokens: ${response.statusText}`)
    }

    const tokenResponse = (await response.json()) as OAuth.TokenResponse
    tokenResponse.refresh_token = tokenResponse.refresh_token ?? refreshToken

    logger.log({
        title: "Refreshed Tokens",
        data: {
            hasAccessToken: Boolean(tokenResponse.access_token),
            hasRefreshToken: Boolean(tokenResponse.refresh_token),
            expires_in: tokenResponse.expires_in,
            scope: tokenResponse.scope
        }
    })

    return tokenResponse
}
