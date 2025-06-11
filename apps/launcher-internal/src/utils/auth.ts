/**
 *
 */

import { createAuthClient } from "better-auth/react"

import { getBaseUrl } from "./get-base-url"

const _authClient = createAuthClient({
    baseURL: `${getBaseUrl()}/api/auth`,
    plugins: [
        //  Custom plugin?
    ]
})

export const authClient = {
    ..._authClient
}
