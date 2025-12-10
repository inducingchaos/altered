/**
 *
 */

import { createAuthClient } from "better-auth/react"

type AuthClient = ReturnType<typeof createAuthClient>
export type AuthContext = AuthClient["$Infer"]["Session"]

export const authClient: AuthClient = createAuthClient({
    /**
     * @todo [P3] Use `locations.origins.current` from the "locations" config once the client/server boundary config issues are resolved.
     */
    baseURL: undefined
})
