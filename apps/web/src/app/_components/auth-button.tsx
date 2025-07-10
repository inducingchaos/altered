/**
 *
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Session } from "@altered/auth"
import { authClient } from "@altered/auth/client"
import { ArrowRightIcon } from "@altered/ui"
import { Button } from "@altered/ui/button"

export function AuthButton({ session, callback }: { session: Session | null; callback?: string }) {
    const router = useRouter()

    const [isSigningIn, setIsSigningIn] = useState(false)

    if (!session) {
        return (
            <form
                onSubmit={async e => {
                    e.preventDefault()

                    setIsSigningIn(true)

                    await authClient.signIn.social({
                        provider: "google",
                        callbackURL: callback
                    })
                }}
            >
                <Button size="lg" variant="outline" type="submit" disabled={isSigningIn}>
                    {isSigningIn ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-md text-center">
                {session.user.name.trim() ? `Welcome, ${session.user.name.split(" ")[0]}.` : "Welcome."}
            </p>

            <div className="flex flex-col items-center justify-center gap-8">
                <Button
                    size="lg"
                    variant="default"
                    onClick={() => {
                        router.push("/chat")
                    }}
                >
                    {"Go to Chat"}
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Button>

                <form
                    onSubmit={async e => {
                        e.preventDefault()
                        await authClient.signOut()

                        router.refresh()
                    }}
                >
                    <Button size="lg" variant="link" type="submit" className="m-0 size-0 p-0">
                        {"Sign out"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
