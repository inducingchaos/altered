/**
 *
 */

import { config } from "~/config"
import { OAuth } from "@raycast/api"

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

        console.error("Failed to exchange authorization code for tokens:", errorText)

        throw new Error(`Failed to exchange authorization code for tokens: ${response.statusText}`)
    }

    return (await response.json()) as OAuth.TokenResponse
}
