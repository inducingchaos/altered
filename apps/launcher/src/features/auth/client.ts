/**
 *
 */

import { authenticateWithTokens, retrieveAccessToken } from "./oidc"

export function createAuthClient(): { isAuthed: () => Promise<boolean>; authenticate: () => Promise<void>; getToken: () => Promise<string | null> } {
    let token: string | null | undefined = undefined

    const isAuthed = async () => {
        if (token || token === null) return !!token

        const currentToken = await retrieveAccessToken()
        const isAuthed = !!(currentToken && !currentToken.isExpired)

        if (isAuthed) token = currentToken.token

        return isAuthed
    }

    const authenticate = async () => {
        const newToken = await authenticateWithTokens()

        token = newToken
    }

    const getToken = async () => {
        if (await isAuthed()) return token!

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
