/**
 *
 */

"use client"

import { useRouter } from "next/navigation"
import { HTMLAttributes } from "react"

export function Button({ className, children, redirectTo = "/", size = "normal" }: HTMLAttributes<HTMLButtonElement> & { redirectTo?: string; size?: "normal" | "compact" }) {
    const router = useRouter()

    return (
        <div className={className}>
            <button className={`h-8 px-4 bg-foreground text-background font-mono text-sm font-medium hover:opacity-75 ${size === "compact" ? "px-4 h-8" : "px-5 h-10"}`} onClick={() => (redirectTo ? router.push(redirectTo) : undefined)}>
                {children}
            </button>
        </div>
    )
}
