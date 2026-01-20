/**
 *
 */

import { authClient } from "@altered-internal/auth/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "@/components/toast"
import { replaceURL } from "./utils"

export function useAuth() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const isLoadingRef = useRef(isLoading)

    isLoadingRef.current = isLoading

    const handleSignIn = useCallback((options?: { callbackUrl?: string }) => {
        if (isLoadingRef.current)
            return toast({
                type: "error",
                description: "Loading, please wait..."
            })

        setIsLoading(true)

        authClient.signIn.social(
            {
                provider: "google",
                callbackURL:
                    options?.callbackUrl ??
                    `${window.location.href}?callback=auth`
            },
            {
                onSuccess: () => {
                    setIsLoading(false)
                },

                onError: () => {
                    setIsLoading(false)

                    toast({
                        type: "error",
                        description:
                            "Failed to sign in. Please try again later."
                    })
                }
            }
        )
    }, [])

    const handleSignOut = useCallback(() => {
        if (isLoadingRef.current)
            return toast({
                type: "error",
                description: "Loading, please wait..."
            })

        setIsLoading(true)

        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")

                    router.refresh()

                    setIsLoading(false)

                    toast({
                        type: "success",
                        description: "Successfully signed out."
                    })
                },

                onError: () => {
                    setIsLoading(false)

                    toast({
                        type: "error",
                        description:
                            "Failed to sign out. Please try again later."
                    })
                }
            }
        })
    }, [router])

    return {
        isLoading,

        signIn: handleSignIn,
        signOut: handleSignOut
    }
}

/**
 * @todo
 * - [P3] Generalize to handle and perform actions on any query params.
 * - [P3] Move all references to a client component in the root layout.
 */
export function useAuthCallback() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const isAuthCallback = searchParams.get("callback") === "auth"

        if (isAuthCallback) {
            toast({
                type: "success",
                description: "Successfully signed in."
            })

            params.delete("callback")

            const stringifiedParams = params.toString()
            const hasParams = Boolean(stringifiedParams)

            const newUrl = hasParams
                ? `${pathname}?${stringifiedParams}`
                : pathname

            //  Intentionally does not use `router.replace()` to avoid triggering re-renders. Since we simply remove params on-load, re-rendering again will mess up load animations and is not necessary.

            replaceURL(newUrl)
        }
    }, [searchParams, pathname])
}
