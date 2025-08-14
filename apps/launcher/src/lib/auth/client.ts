/**
 *
 */

import { createAuthClient } from "better-auth/react"

import config from "../../config"
import { baseUrl } from "../environment"

/**
 * @todo [P2] Set up auth.
 */
export const authClient = createAuthClient({
    baseURL: `${baseUrl}${config.paths.api.endpoints.auth}`
})
