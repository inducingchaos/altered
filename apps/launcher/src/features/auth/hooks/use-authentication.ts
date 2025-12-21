/**
 *
 */

import { useEffect, useState } from "react"
import { configureLogger } from "~/observability"
import { authenticateWithTokens, retrieveAccessToken } from "../oidc"

const logger = configureLogger({ defaults: { scope: "hooks:use-authentication" } })

export function useAuthentication(): { isAuthed: boolean | null; authenticate: () => Promise<void>; authToken: string | null } {
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [authStatus, setAuthStatus] = useState<boolean | null>(null)

    useEffect(() => {
        retrieveAccessToken()
            .then(token => {
                setAuthToken(token)

                setAuthStatus(Boolean(token))
            })
            .catch(error => {
                logger.error({ title: "Failed to Check Auth Status", data: { error } })

                setAuthStatus(false)
            })
    }, [])

    const authenticate = async () => {
        try {
            const token = await authenticateWithTokens()

            setAuthToken(token)

            setAuthStatus(true)
        } catch (error) {
            logger.error({ title: "Failed to Authenticate", data: { error } })

            setAuthStatus(false)
        }
    }

    return {
        isAuthed: authStatus,
        authenticate,
        authToken
    }
}
