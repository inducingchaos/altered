/**
 * @todo [P3] Review, refactor, and move. Used to preserve the callback URL throughout the OAuth flow.
 */

export type SignInSearchParams = Record<string, string | string[] | undefined>

function normalizeParams(params: SignInSearchParams): Record<string, string> {
    return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === "string") acc[key] = value
        else if (Array.isArray(value)) acc[key] = value[0] ?? ""
        return acc
    }, {})
}

function buildOAuthCallbackUrl(params: SignInSearchParams): string | undefined {
    const clientId = params["client_id"]
    if (typeof clientId !== "string") return undefined
    const serialized = new URLSearchParams(normalizeParams(params)).toString()
    return `/api/auth/oauth2/authorize?${serialized}`
}

export function resolveCallbackUrl(params: SignInSearchParams): string {
    const oauthCallbackUrl = buildOAuthCallbackUrl(params)
    const explicitCallback = params["callback-url"]
    if (oauthCallbackUrl) return oauthCallbackUrl
    if (typeof explicitCallback === "string") return explicitCallback
    return "/"
}
