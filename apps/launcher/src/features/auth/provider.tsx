/**
 *
 */

import { createContext, ReactNode, use, useCallback, useEffect, useMemo, useState } from "react"
import { authenticateWithTokens, retrieveAccessToken } from "./oidc"

type AuthContextBaseValue = {
    authenticate: () => Promise<string>
}

type AuthContextLoadingValue = AuthContextBaseValue & {
    status: "loading"

    isLoading: true
    isAuthed: false
    token: null
}

type AuthContextAuthenticatedValue = AuthContextBaseValue & {
    status: "authenticated"

    isLoading: false
    isAuthed: true
    token: string
}

type AuthContextUnauthenticatedValue = AuthContextBaseValue & {
    status: "unauthenticated"

    isLoading: false
    isAuthed: false
    token: null
}

type AuthContextValue = AuthContextLoadingValue | AuthContextAuthenticatedValue | AuthContextUnauthenticatedValue

export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * @todo [P4] We could likely refactor this to use the same auth functions as `createAuthClient` instead of duplicating the logic here.
 */
export function AuthProvider(props: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    const [token, setToken] = useState<string | null>(null)

    /**
     * @todo [P3] Improve logic. If the current token is expired, we should automatically refresh it. If expired AND not refreshable, we *shouldn't* automatically start the OAuth flow - it should be triggered manually by the implementing view.
     */
    const loadToken = useCallback(async (): Promise<void> => {
        setIsLoading(true)

        const currentToken = await retrieveAccessToken()

        if (currentToken && currentToken.isExpired) {
            const newToken = await authenticateWithTokens()

            setToken(newToken)
        } else if (currentToken) {
            setToken(currentToken.token)
        } else setToken(null)

        setIsLoading(false)
    }, [])

    const authenticate = useCallback(async () => {
        const newToken = await authenticateWithTokens()

        setToken(newToken)

        return newToken
    }, [])

    useEffect(() => void loadToken(), [])

    const baseValue: AuthContextBaseValue = useMemo(
        () => ({
            authenticate
        }),
        [authenticate]
    )

    const value: AuthContextValue = useMemo(() => {
        if (isLoading)
            return {
                ...baseValue,

                status: "loading",

                isLoading: true,
                isAuthed: false,
                token: null
            }

        if (token)
            return {
                ...baseValue,

                status: "authenticated",

                isLoading: false,
                isAuthed: true,
                token
            }

        return {
            ...baseValue,

            status: "unauthenticated",

            isLoading: false,
            isAuthed: false,
            token: null
        }
    }, [baseValue, isLoading, token])

    return <AuthContext value={value}>{props.children}</AuthContext>
}

export function useAuthentication() {
    const context = use(AuthContext)

    if (!context) throw new Error("`useAuthentication` must be used within an `AuthProvider`.")

    return context
}
