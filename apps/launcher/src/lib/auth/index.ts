/**
 *
 */

import { withAccessToken } from "@raycast/utils"
import { authenticateWithTokens } from "./oidc"

/**
 * Wraps any "view", "no-view", or "menu-bar" command to intercept rendering and ensure authentication.
 */
export const withAuthentication = withAccessToken({ authorize: authenticateWithTokens })

export * from "./client"
