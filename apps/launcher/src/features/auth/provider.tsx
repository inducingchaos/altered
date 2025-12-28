/**
 *
 */

import { createContext, ReactNode, use, useEffect, useState } from "react"
import { authenticateWithTokens, retrieveAccessToken } from "./oidc"

type AnyAuthContextValue = {
    isAuthed: boolean
    isLoading: boolean
    token: string | null
    authenticate: () => Promise<string>
}
type AuthedAuthContextValue = AnyAuthContextValue & {
    isAuthed: true
    token: string
}
type UnauthedAuthContextValue = AnyAuthContextValue & {
    isAuthed: false
    token: null
}

type AuthContextValue = AuthedAuthContextValue | UnauthedAuthContextValue

export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * @todo [P4] We could likely refactor this to use the same auth functions as `createAuthClient` instead of duplicating the logic here.
 */
export function AuthProvider(props: { children: ReactNode }) {
    const [token, setToken] = useState<string | null | undefined>()

    const isLoading = token === undefined
    const isAuthed = !!token

    const getAuthStatus = async () => {
        if (token || token === null) return !!token

        const currentToken = await retrieveAccessToken()

        //  TODO [P3] Improve auto-refresh logic. If we check the auth status and an existing token is expired - we should automatically refresh it. If not, we should require manual confirmation before authenticating.

        if (currentToken?.isExpired) {
            const newToken = await authenticateWithTokens()

            setToken(newToken)
            return true
        }

        if (currentToken) setToken(currentToken.token)
        else setToken(null)

        return currentToken ? true : false
    }

    const authenticate = async () => {
        const newToken = await authenticateWithTokens()

        setToken(newToken)
        return newToken
    }

    useEffect(() => void getAuthStatus(), [])

    const isDiscriminatedValue = (value: AnyAuthContextValue): value is AuthContextValue => (value.token === null && value.isAuthed === false) || (value.token !== null && value.isAuthed === true)

    const value = {
        isLoading,
        isAuthed,
        token: token ?? null,
        authenticate
    }

    if (!isDiscriminatedValue(value)) throw new Error("Invalid `AuthContext` value. This should never happen.")

    return <AuthContext value={value}>{props.children}</AuthContext>
}

export function useAuthentication() {
    const context = use(AuthContext)

    if (!context) throw new Error("`useAuthentication` must be used within an `AuthProvider`.")

    return context
}
