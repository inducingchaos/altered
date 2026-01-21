/**
 *
 */

"use client"

import { authClient } from "@altered-internal/auth/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DynamicTextSizer } from "~/components/ui/_legacy"

type ButtonState = {
    buttonText: string
    onClick?: () => void
}

export function AuthButtonWithoutSession({
    isAuthenticated,
    className
}: {
    isAuthenticated?: boolean
    className?: string
}) {
    const router = useRouter()
    const [isWorking, setIsWorking] = useState(false)

    const buttonStates: Record<string, ButtonState> = {
        signedIn: {
            buttonText: "sign out",
            onClick: () =>
                authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/")

                            router.refresh()
                        }
                    }
                })
        },
        signedOut: {
            buttonText: "sign in",
            onClick: () => authClient.signIn.social({ provider: "google" })
        },
        loading: {
            buttonText: "loading..."
        }
    }

    const isLoading = isWorking || isAuthenticated === undefined

    const getButtonStateKey = () => {
        if (isLoading) return "loading"
        if (isAuthenticated) return "signedIn"
        return "signedOut"
    }
    //  TODO [P2] Review this code.

    useEffect(() => {
        setIsWorking(false)
    }, [])

    const buttonState = buttonStates[getButtonStateKey()]

    if (!buttonState) return null

    const onClick = () => {
        if (isLoading) return

        setIsWorking(true)
        buttonState.onClick?.()
    }

    return (
        <div className={className}>
            <button
                className="h-8 bg-foreground px-4 font-medium font-mono text-background text-sm hover:opacity-75 disabled:opacity-50"
                disabled={isLoading}
                onClick={onClick}
                type="button"
            >
                <DynamicTextSizer
                    currentValue={buttonState.buttonText}
                    possibleValues={Object.values(buttonStates).map(
                        buttonState => buttonState.buttonText
                    )}
                />
            </button>
        </div>
    )
}
