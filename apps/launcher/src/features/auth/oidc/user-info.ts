/**
 *
 */

import { config } from "~/config"
import { configureLogger } from "~/observability"

const logger = configureLogger({ defaults: { scope: "oauth:user-info" } })

export type OAuthUserInfo = {
    sub: string
    name?: string
    email?: string
    email_verified?: boolean
    picture?: string
    [key: string]: unknown
}

/**
 * Fetches information from the OAuth provider's user info endpoint.
 */
export async function getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch(config.oauthUserInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!response.ok) {
        logger.error({ title: "Failed to Fetch User Info", data: { response: await response.text() } })

        throw new Error(`Failed to fetch user info: ${response.statusText}`)
    }

    return (await response.json()) as OAuthUserInfo
}
