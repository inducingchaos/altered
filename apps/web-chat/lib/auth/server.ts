/**
 * @remarks Delegates and shares BetterAuth auth across subdomains of "altered.app".
 */

import "server-only"

import { auth } from "@altered-internal/auth"
import { headers } from "next/headers"
import type { User } from "./index"

export async function getSession() {
    const sessionResult = await auth.api.getSession({
        headers: await headers()
    })

    if ("error" in sessionResult) return null
    const { user } = sessionResult.data

    return {
        id: user.id,
        email: user.email
    } satisfies User
}
