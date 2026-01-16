/**
 * @todo [P3] Move all database queries to the data-access layer.
 */

import { db } from "@altered-internal/data/store"
import type { AmbiguousSessionResult } from "./get-ambiguous-session"

/**
 * Guards and retrieves a compatible auth session using an API key.
 *
 * @todo [P2] Revise - uses temporary values. Implement database and infrastructure changes to support a valid session if we continue to use this method.
 */
export async function getApiKeySession({
    headers
}: {
    headers: Headers
}): Promise<AmbiguousSessionResult> {
    const apiKeyValue = headers.get("authorization")?.replace("Bearer ", "")
    if (!apiKeyValue)
        return {
            error: {
                code: "BAD_REQUEST",
                message: "No API key was provided.",
                cause: { authorization: headers.get("authorization") }
            }
        }

    const user = await db.query.users.findFirst({
        where: {
            apiKeys: {
                value: apiKeyValue
            }
        },
        with: {
            apiKeys: {
                where: {
                    value: apiKeyValue
                }
            }
        }
    })

    const apiKey = user?.apiKeys?.[0]

    if (!(user && apiKey))
        return {
            error: {
                code: "UNAUTHORIZED",
                message: "The provided API key does not exist.",
                cause: { authorization: headers.get("authorization") }
            }
        }

    const tempExpiresAt = new Date()
    tempExpiresAt.setDate(tempExpiresAt.getDate() + 7)

    return {
        data: {
            user,
            session: {
                ...apiKey,
                token: apiKey.value,
                expiresAt: tempExpiresAt
            }
        }
    }
}
