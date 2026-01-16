/**
 *
 */

import { auth } from "@altered-internal/auth"
import { apiFactory } from "../factory"

/**
 * @todo [P1] We really need to revise our auth strategy for different authentication strategies. Right now, we have some conflicts: our web app uses the BetterAuth client to authenticate with the BetterAuth API endpoints using cookies; our launcher (Raycast) uses Raycast's raw OAuth utils to retrieve a token from the BetterAuth Oauth2 endpoint (we *may* be able to transition this app to use the BetterAuth client with the updated OAuth plugin) and once we have an access token, we simply send it as a Bearer token in the "authorization" header. Then, we resolve the token in our modified `getAmbiguousSession` handler via `getSession`. Additionally, we allow authentication via an API key for OpenAI-compatible AI chat clients. The main conflict currently is that the API key is sent via the "authorization" header also, and we have no implemented way of diffing between the two (causing the lookup in our database to fail). BetterAuth supports all of these via plugins, so the best method may be to use them to centralize and disambiguate the auth methods. However one concern is the additional auth implementations needed in Raycast (e.g., leveraging their PKCE client to trigger the proprietary "Sign in with ALTERED" screen) but we may be able to work around that by using BetterAuth's hooks or a custom plugin.
 */
export const requireAuth = apiFactory.middleware(
    async ({ context, next, errors }) => {
        const { data: session, error: sessionError } =
            await auth.api.getSession({ headers: context.request.headers })

        if (sessionError)
            throw errors[sessionError.code]({
                message: sessionError.message,
                cause: sessionError.cause
            })

        return next({ context: { auth: session } })
    }
)
