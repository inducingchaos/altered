/**
 *
 */

export type User = {
    id: string
    email: string
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
