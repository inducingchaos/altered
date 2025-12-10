/**
 *
 */

import { OAuth } from "@raycast/api"
import { config } from "~/config"

/**
 * A PKCE client that handles the low-level OAuth flow.
 */
export function createPKCEClient(): OAuth.PKCEClient {
    return new OAuth.PKCEClient({
        redirectMethod: OAuth.RedirectMethod.Web,
        providerName: config.appName,
        providerIcon: config.appIcon,
        description: config.oauthProviderDescription,
        providerId: config.oauthProviderId
    })
}
