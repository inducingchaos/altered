/**
 *
 */

import { auth } from "@altered-internal/auth"
import { headers } from "next/headers"
import { Suspense } from "react"
import { AuthButtonWithoutSession } from "./client"

export async function AuthButtonWithoutSuspense() {
    const { data: session } = await auth.api.getSession({ headers: await headers() })

    return <AuthButtonWithoutSession isAuthenticated={!!session} />
}

export function AuthButton() {
    return (
        <Suspense fallback={<AuthButtonWithoutSession />}>
            <AuthButtonWithoutSuspense />
        </Suspense>
    )
}
