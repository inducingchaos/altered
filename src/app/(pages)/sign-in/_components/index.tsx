/**
 *
 */

"use client"

import { useEffect } from "react"
import { authClient } from "~/lib/auth/client"

export function SignInOnMount({ callbackUrl }: { callbackUrl: string | undefined }) {
    useEffect(() => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: callbackUrl
        })
    }, [])

    return <></>
}
