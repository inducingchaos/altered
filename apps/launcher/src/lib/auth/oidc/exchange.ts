/**
 *
 */

import { OAuth } from "@raycast/api"
import { config } from "~/config"
import { createLogger } from "~/lib/observability"

const logger = createLogger({ defaults: { scope: "oauth:exchange" } })

/**
 * Exchanges an OAuth authorization code for an access token and refresh token.
 */
export async function exchangeCodeForTokens(authRequest: OAuth.AuthorizationRequest, authorizationCode: string): Promise<OAuth.TokenResponse> {
    const params = new URLSearchParams()

    params.append("client_id", config.oauthClientId)
    params.append("code", authorizationCode)
    params.append("code_verifier", authRequest.codeVerifier)
    params.append("grant_type", "authorization_code")
    params.append("redirect_uri", authRequest.redirectURI)

    const response = await fetch(config.oauthTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })

    if (!response.ok) {
        const errorText = await response.text()

        logger.error({
            title: "Failed to Exchange Code for Tokens",
            data: { status: response.status, statusText: response.statusText, body: errorText }
        })

        throw new Error(`Failed to exchange authorization code for tokens: ${response.statusText}`)
    }

    const tokenResponse = (await response.json()) as OAuth.TokenResponse

    logger.log({
        title: "Exchanged Code for Tokens",
        data: {
            hasAccessToken: Boolean(tokenResponse.access_token),
            hasRefreshToken: Boolean(tokenResponse.refresh_token),
            expires_in: tokenResponse.expires_in,
            scope: tokenResponse.scope
        }
    })

    return tokenResponse
}
