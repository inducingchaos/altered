/**
 *
 */

import type { Route } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getSession } from "@/lib/auth"
import { SignInContent } from "./client"

async function SignInContentWrapper({
    searchParams
}: {
    searchParams: Promise<{ "callback-url"?: string }>
}) {
    const { "callback-url": callbackUrl } = await searchParams

    const user = await getSession()

    if (user) redirect(callbackUrl as Route)

    return (
        <Suspense fallback={null}>
            <SignInContent callbackUrl={callbackUrl} />
        </Suspense>
    )
}

/**
 * @remarks This additional suspense wrapper is required for Cache Components.
 */
export default async function SignInPage({
    searchParams
}: {
    searchParams: Promise<{ "callback-url"?: string }>
}) {
    return (
        <Suspense fallback={null}>
            <SignInContentWrapper searchParams={searchParams} />
        </Suspense>
    )
}
