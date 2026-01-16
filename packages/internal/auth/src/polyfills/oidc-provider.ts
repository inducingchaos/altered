/**
 *
 */

import { db, eq, oauthAccessTokens, or } from "@altered-internal/data/store"
import type { BetterAuthPlugin } from "better-auth"
import { APIError } from "better-auth"
import { createAuthEndpoint } from "better-auth/plugins"

/**
 * Implements OAuth 2.0 Token Revocation (RFC 7009) which is not yet available in BetterAuth's OIDC plugin.
 */
export const oidcProviderPolyfill = () => {
    return {
        id: "oidc-polyfill",
        endpoints: {
            revoke: createAuthEndpoint(
                "/oauth2/revoke",

                {
                    method: "POST",
                    metadata: {
                        allowedMediaTypes: [
                            "application/x-www-form-urlencoded",
                            "application/json"
                        ]
                    }
                },

                async ctx => {
                    let body = ctx.body

                    if (body instanceof FormData)
                        body = Object.fromEntries(body.entries())

                    if (!body || typeof body !== "object") {
                        throw new APIError("BAD_REQUEST", {
                            error_description: "request body is required",
                            error: "invalid_request"
                        })
                    }

                    const { token, token_type_hint, client_id } = body as {
                        token?: string | string[]
                        token_type_hint?: string | string[]
                        client_id?: string | string[]
                    }

                    const tokenValue = Array.isArray(token) ? token[0] : token
                    const clientIdValue = Array.isArray(client_id)
                        ? client_id[0]
                        : client_id
                    const tokenTypeHint = Array.isArray(token_type_hint)
                        ? token_type_hint[0]
                        : token_type_hint

                    if (!tokenValue) {
                        throw new APIError("BAD_REQUEST", {
                            error_description: "token is required",
                            error: "invalid_request"
                        })
                    }

                    if (!clientIdValue) {
                        throw new APIError("BAD_REQUEST", {
                            error_description: "client_id is required",
                            error: "invalid_request"
                        })
                    }

                    const tokenRecord = await db
                        .select()
                        .from(oauthAccessTokens)
                        .where(
                            tokenTypeHint === "refresh_token"
                                ? eq(oauthAccessTokens.refreshToken, tokenValue)
                                : tokenTypeHint === "access_token"
                                  ? eq(
                                        oauthAccessTokens.accessToken,
                                        tokenValue
                                    )
                                  : or(
                                        eq(
                                            oauthAccessTokens.accessToken,
                                            tokenValue
                                        ),
                                        eq(
                                            oauthAccessTokens.refreshToken,
                                            tokenValue
                                        )
                                    )
                        )
                        .limit(1)
                        .then(rows => (rows[0] ? rows[0] : null))

                    if (tokenRecord && tokenRecord.clientId !== clientIdValue)
                        return ctx.json({}, { status: 200 })

                    if (tokenRecord)
                        await db
                            .delete(oauthAccessTokens)
                            .where(eq(oauthAccessTokens.id, tokenRecord.id))

                    return ctx.json({}, { status: 200 })
                }
            )
        }
    } satisfies BetterAuthPlugin
}
