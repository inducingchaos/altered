/**
 *
 */

"use client"

import { useAuthCallback } from "@/lib/auth/hooks"

export function AuthCallbackHandler() {
    useAuthCallback()

    return null
}
