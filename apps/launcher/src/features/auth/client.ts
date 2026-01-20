/**
 *
 */

import { authenticateWithTokens, retrieveAccessToken } from "./oidc"

export function createAuthClient(): {
    isAuthed: () => Promise<boolean>
    authenticate: () => Promise<void>
    getToken: () => Promise<string | null>
} {
    let token: string | null | undefined

    const isAuthed = async () => {
        if (token || token === null) return !!token

        const currentToken = await retrieveAccessToken()

        //  TODO [P3] Improve auto-refresh logic. If we check the auth status and an existing token is expired - we should automatically refresh it. If not, we should require manual confirmation before authenticating.

        if (currentToken?.isExpired) {
            const newToken = await authenticateWithTokens()

            token = newToken
            return true
        }

        if (currentToken) token = currentToken.token
        else token = null

        return currentToken ? true : false
    }

    const authenticate = async () => {
        const newToken = await authenticateWithTokens()

        token = newToken
    }

    const getToken = async () => {
        if (token || token === null) return token

        const newToken = await authenticateWithTokens()
        token = newToken

        return newToken
    }

    return {
        isAuthed,
        authenticate,
        getToken
    }
}

export const authClient = createAuthClient()
