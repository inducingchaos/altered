/**
 *
 */

"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth/client"

export function SignInContent({ callbackUrl }: { callbackUrl?: string }) {
    const { signIn } = useAuth()

    useEffect(() => {
        signIn({ callbackUrl })
    }, [signIn, callbackUrl])

    return (
        <div className="flex h-dvh items-center justify-center">
            <div>Signing in...</div>
        </div>
    )
}
