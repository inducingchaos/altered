/**
 *
 */

import { AuthContext } from ".."
import { authBase } from "../base"
import { getApiKeySession } from "./get-api-key-session"
import { getOAuth2Session } from "./get-oauth2-session"

/**
 * @todo [P3] Improve this, move this, etc.
 */
export type AmbiguousSessionResult = { data: AuthContext; error?: never } | { data?: never; error: { code: "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR"; message: string; cause?: unknown } }

/**
 * Supports and handles headers for both cookie and OAuth-based authentication flows.
 *
 * @todo [P0] The current solution uses some odd header values to disambiguate the type of authorization token and method. Revise to a more reliable and scalable solution.
 */
export async function getAmbiguousSession({ headers }: { headers: Headers }): Promise<AmbiguousSessionResult> {
    if (headers.get("cookie")) {
        const session = await authBase.api.getSession({ headers })

        if (session) return { data: session }
    }

    if (headers.get("authorization")) {
        if (headers.get("x-client-id") === "altered-launcher") return getOAuth2Session({ headers })

        return await getApiKeySession({ headers })
    }

    if (!headers.get("cookie") && !headers.get("authorization")) return { error: { code: "BAD_REQUEST", message: "No authentication headers were provided.", cause: { authorization: headers.get("authorization"), cookie: headers.get("cookie") } } }

    return { error: { code: "UNAUTHORIZED", message: "No authentication session could be found.", cause: { authorization: headers.get("authorization"), cookie: headers.get("cookie") } } }
}
