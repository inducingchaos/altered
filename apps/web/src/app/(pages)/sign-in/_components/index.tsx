/**
 * @todo [P3] Remove when we create a proper sign in page.
 */

"use client"

import { authClient } from "@altered-internal/auth/client"
import { useEffect } from "react"

/**
 * @todo [P3] Could this just be a hook?
 */
export function SignInOnMount({
    callbackUrl
}: {
    callbackUrl: string | undefined
}) {
    useEffect(() => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: callbackUrl
        })
    }, [callbackUrl])

    return null
}
