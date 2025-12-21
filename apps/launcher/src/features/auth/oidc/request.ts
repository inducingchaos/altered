/**
 *
 */

import { OAuth } from "@raycast/api"
import { config } from "~/config"

/**
 * Requests an OAuth authorization code from the OAuth provider.
 */
export async function requestAuthorizationCode(client: OAuth.PKCEClient): Promise<{ authorizationCode: string; authRequest: OAuth.AuthorizationRequest }> {
    const authRequest = await client.authorizationRequest({
        endpoint: config.oauthAuthorizationEndpoint,
        clientId: config.oauthClientId,
        scope: config.oauthClientScope
    })

    const { authorizationCode } = await client.authorize(authRequest)

    return { authorizationCode, authRequest }
}
