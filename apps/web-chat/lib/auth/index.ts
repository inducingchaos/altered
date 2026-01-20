/**
 *
 */

import "server-only"

import { auth } from "@altered-internal/auth"
import { headers } from "next/headers"
import type { ChatUser } from "./shared"

export async function getSession(): Promise<ChatUser | null> {
    const sessionResult = await auth.api.getSession({
        headers: await headers()
    })

    if ("error" in sessionResult) return null

    const { user, session: _session } = sessionResult.data

    return {
        id: user.id,
        email: user.email
    }
}
