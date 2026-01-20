/**
 *
 */

import type { BetterAuthClientOptions } from "better-auth"
import { createAuthClient } from "better-auth/react"

/**
 * @todo [P3] Update to use the config package when we finalize it.
 */
export const getCurrentOrigin = () => {
    const isDevelopment = process.env.NODE_ENV === "development"

    if (isDevelopment) return "http://localhost:258"

    const vercelEnvironment =
        process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV

    if (vercelEnvironment === "preview") return "https://preview.altered.app"

    return "https://altered.app"
}

const authClientOptions: BetterAuthClientOptions = {
    /**
     * @todo [P3] Use `locations.origins.current` from the "locations" config once the client/server boundary config issues are resolved.
     */
    baseURL: getCurrentOrigin()
}

export const authClient = createAuthClient(authClientOptions)

export type ClientAuthContext = typeof authClient.$Infer.Session
