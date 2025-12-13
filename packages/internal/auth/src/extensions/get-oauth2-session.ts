/**
 * @todo [P3] Move all database queries to the data-access layer.
 */

import { db } from "@altered-internal/data/store"
import { AmbiguousSessionResult } from "./get-ambiguous-session"

/**
 * Guards and retrieves a compatible auth session using OAuth credentials.
 */
export async function getOAuth2Session({ headers }: { headers: Headers }): Promise<AmbiguousSessionResult> {
    const token = headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return { error: { code: "BAD_REQUEST", message: "No authorization token was provided.", cause: { authorization: headers.get("authorization") } } }

    const accessToken = await db.query.oauthAccessTokens.findFirst({ where: { accessToken: token } })
    if (!accessToken) return { error: { code: "UNAUTHORIZED", message: "The provided authorization token does not exist.", cause: { authorization: headers.get("authorization") } } }

    if (accessToken.accessTokenExpiresAt < new Date()) return { error: { code: "UNAUTHORIZED", message: "The provided authorization token has expired.", cause: { authorization: headers.get("authorization") } } }

    /**
     * @todo [P4] We can get the list of trusted clients from the BetterAuth configuration.
     */
    const trustedClientIds = ["altered-launcher"]

    if (!trustedClientIds.includes(accessToken.clientId)) {
        const oauthApplication = await db.query.oauthApplications.findFirst({ where: { clientId: accessToken.clientId } })

        if (!oauthApplication) return { error: { code: "UNAUTHORIZED", message: "The provided authorization token is not associated with a trusted client.", cause: { authorization: headers.get("authorization") } } }
    }

    const user = await db.query.users.findFirst({ where: { id: accessToken.userId } })
    if (!user) return { error: { code: "UNAUTHORIZED", message: "The provided authorization token is not associated with a known user.", cause: { authorization: headers.get("authorization") } } }

    return {
        data: {
            user,
            session: {
                id: accessToken.id,
                userId: accessToken.userId,
                expiresAt: accessToken.accessTokenExpiresAt,
                token: accessToken.accessToken,
                createdAt: accessToken.createdAt,
                updatedAt: accessToken.updatedAt
            }
        }
    }
}
