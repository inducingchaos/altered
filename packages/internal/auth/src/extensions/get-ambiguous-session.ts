/**
 *
 */

import { AuthContext } from ".."
import { authBase } from "../base"
import { getOAuth2Session } from "./get-oauth2-session"

/**
 * @todo [P3] Improve this, move this, etc.
 */
export type AmbiguousSessionResult = { data: AuthContext; error?: never } | { data?: never; error: { code: "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR"; message: string; cause?: unknown } }

/**
 * Supports and handles headers for both cookie and OAuth-based authentication flows.
 */
export async function getAmbiguousSession({ headers }: { headers: Headers }): Promise<AmbiguousSessionResult> {
    if (headers.get("cookie")) {
        const session = await authBase.api.getSession({ headers })

        if (session) return { data: session }
    }

    if (headers.get("authorization")) {
        const sessionResult = await getOAuth2Session({ headers })

        if (sessionResult.data) return sessionResult
    }

    if (!headers.get("cookie") && !headers.get("authorization")) return { error: { code: "BAD_REQUEST", message: "No authentication headers were provided.", cause: { authorization: headers.get("authorization"), cookie: headers.get("cookie") } } }

    return { error: { code: "UNAUTHORIZED", message: "No authentication session could be found.", cause: { authorization: headers.get("authorization"), cookie: headers } } }
}
