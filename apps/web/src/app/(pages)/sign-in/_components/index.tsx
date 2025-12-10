/**
 * @todo [P3] Remove when we create a proper sign in page.
 */

"use client"

import { useEffect } from "react"
import { authClient } from "@altered-internal/auth/client"

export function SignInOnMount({ callbackUrl }: { callbackUrl: string | undefined }) {
    useEffect(() => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: callbackUrl
        })
    }, [callbackUrl])

    return <></>
}
