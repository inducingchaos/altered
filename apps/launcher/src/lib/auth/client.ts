/**
 *
 */

import { authenticateWithTokens, retrieveAccessToken } from "~/lib/auth/oidc"

export function createAuthClient(): { isAuthed: () => Promise<boolean>; authenticate: () => Promise<void>; getToken: () => Promise<string | null> } {
    let token: string | null | undefined = undefined

    const isAuthed = async () => {
        if (token || token === null) return !!token

        token = await retrieveAccessToken()

        return !!token
    }

    const authenticate = async () => {
        token = await authenticateWithTokens()
    }

    const getToken = async () => {
        if (token || token === null) return token

        token = await retrieveAccessToken()

        return token
    }

    return {
        isAuthed,
        authenticate,
        getToken
    }
}

export const authClient = createAuthClient()
