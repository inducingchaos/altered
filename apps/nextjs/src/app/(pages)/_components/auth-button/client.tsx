/**
 *
 */

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DynamicTextSizer } from "~/components/ui"
import { authClient } from "~/lib/auth/client"

type ButtonState = {
    buttonText: string
    onClick?: () => Promise<unknown> | void
}

export function AuthButtonWithoutSession({ isAuthenticated, className }: { isAuthenticated?: boolean; className?: string }) {
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
    const buttonState = buttonStates[isLoading ? "loading" : isAuthenticated ? "signedIn" : "signedOut"]

    const onClick = async () => {
        if (isLoading) return

        setIsWorking(true)
        await buttonState.onClick?.()
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsWorking(false)
    }, [isAuthenticated])

    return (
        <div className={className}>
            <button className="h-8 px-4 bg-foreground text-background font-mono text-sm font-medium hover:opacity-75 disabled:opacity-50" disabled={isLoading} onClick={onClick}>
                <DynamicTextSizer possibleValues={Object.values(buttonStates).map(buttonState => buttonState.buttonText)} currentValue={buttonState.buttonText} />
            </button>
        </div>
    )
}
