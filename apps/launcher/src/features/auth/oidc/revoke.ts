/**
 *
 */

import { config } from "~/config"
import { configureLogger } from "~/observability"

const logger = configureLogger({ defaults: { scope: "oauth:revoke" } })

/**
 * Revokes the given OAuth token set from the provider. Accepts a lookup token and the type of token.
 */
export async function revokeTokens(token: string, tokenTypeHint?: "access_token" | "refresh_token"): Promise<void> {
    const params = new URLSearchParams()

    params.append("token", token)
    params.append("client_id", config.oauthClientId)
    if (tokenTypeHint) params.append("token_type_hint", tokenTypeHint)

    const response = await fetch(config.oauthRevokeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })

    if (!response.ok && response.status !== 200) logger.error({ title: "Failed to Revoke Token", data: { response: await response.text() } })
}
