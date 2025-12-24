/**
 *
 */

import { useEffect, useState } from "react"
import { authenticateWithTokens, retrieveAccessToken } from "../oidc"

/**
 * @todo [P4] We could likely refactor this to use the same auth functions as `createAuthClient` instead of duplicating the logic here.
 */
export function useAuthentication(): { isAuthed: boolean; isLoading: boolean; token: string | null; authenticate: () => Promise<string> } {
    const [token, setToken] = useState<string | null | undefined>()

    const isLoading = token === undefined
    const isAuthed = !!token

    const getAuthStatus = async () => {
        if (token || token === null) return !!token

        const currentToken = await retrieveAccessToken()
        const isAuthed = !!(currentToken && !currentToken.isExpired)

        if (isAuthed) setToken(currentToken.token)

        return isAuthed
    }

    const authenticate = async () => {
        const newToken = await authenticateWithTokens()

        setToken(newToken)
        return newToken
    }

    useEffect(() => void getAuthStatus(), [])

    return {
        isLoading,
        isAuthed,
        token: token ?? null,
        authenticate
    }
}
