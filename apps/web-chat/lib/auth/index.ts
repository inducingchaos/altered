/**
 * @remarks Delegates and shares BetterAuth auth across subdomains of "altered.app".
 */

import { auth } from "@altered-internal/auth"
import { headers } from "next/headers"

export type User = {
    id: string
    email: string
}

export async function getSession() {
    const sessionResult = await auth.api.getSession({
        headers: await headers()
    })

    if ("error" in sessionResult) return null
    const { user } = sessionResult.data

    return {
        id: user.id,
        email: user.email
    }
}

/**
 * @todo [P2] Update to use our config when ready.
 */
export const getCurrentOrigin = () => {
    const isDevelopment = process.env.NODE_ENV === "development"

    return {
        "web-chat": isDevelopment
            ? "http://localhost:3000"
            : "https://chat.altered.app",
        web: isDevelopment ? "http://localhost:258" : "https://altered.app"
    }
}

export const signInUrl = `${getCurrentOrigin().web}/sign-in`
