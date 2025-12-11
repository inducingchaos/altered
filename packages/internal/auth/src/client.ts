/**
 *
 */

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /**
     * @todo [P3] Use `locations.origins.current` from the "locations" config once the client/server boundary config issues are resolved.
     */
    baseURL: undefined
})

export type ClientAuthContext = typeof authClient.$Infer.Session
