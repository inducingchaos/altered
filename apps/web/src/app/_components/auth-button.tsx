/**
 *
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Session } from "@altered/auth"
import { authClient } from "@altered/auth/client"
import { CopyIcon } from "@altered/ui"
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

                        //  If we don't include, it goes back to "/api/auth" page (investigate).
                        callbackURL: callback ?? "/"
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
                <div className="flex items-center gap-4 rounded-md border p-4 px-8">
                    <p className="text-md text-center">
                        <span className="font-bold">{"User ID: "}</span>
                        {session.user.id}
                    </p>
                    <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(session.user.id)}>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>

                <form
                    onSubmit={async e => {
                        e.preventDefault()
                        await authClient.signOut()

                        router.refresh()
                    }}
                >
                    <Button size="lg" variant="destructive" type="submit">
                        {"Sign out"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
