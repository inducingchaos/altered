/**
 *
 */

/**
 * @todo [P3] Replace with the config package when we finalize it.
 */
export const getCurrentOrigin = () => {
    const isDevelopment = process.env.NODE_ENV === "development"

    if (isDevelopment) return "http://localhost:3000"

    const vercelEnvironment =
        process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV

    if (vercelEnvironment === "preview")
        return "https://preview.chat.altered.app"

    return "https://chat.altered.app"
}

/**
 * @remarks Does not trigger a re-render. For most cases, you should use `useRouter().replace()` instead.
 */
export function replaceURL(url: string) {
    window.history.replaceState(null, "", url)
}

export function resolveAuthCallbackUrl(url = "/") {
    const origin = getCurrentOrigin()

    const newUrl = new URL(url, origin)

    newUrl.searchParams.set("callback", "auth")

    return newUrl.toString()
}

export function buildSignInUrl(options?: { callbackUrl?: string }) {
    if (!options) return "/sign-in"

    const callbackUrl = resolveAuthCallbackUrl(options.callbackUrl)

    return `/sign-in?callback-url=${encodeURIComponent(callbackUrl)}`
}
