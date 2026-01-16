/**
 *
 */

"use client"

import type { Route } from "next"
import { useRouter } from "next/navigation"
import type { HTMLAttributes } from "react"

export function Button({
    className,
    children,
    redirectTo = "/",
    size = "normal"
}: HTMLAttributes<HTMLButtonElement> & {
    redirectTo?: string
    size?: "normal" | "compact"
}) {
    const router = useRouter()

    return (
        <div className={className}>
            <button
                className={`h-8 bg-foreground px-4 font-medium font-mono text-background text-sm hover:opacity-75 ${size === "compact" ? "h-8 px-4" : "h-10 px-5"}`}
                onClick={() =>
                    redirectTo ? router.push(redirectTo as Route) : undefined
                }
            >
                {children}
            </button>
        </div>
    )
}
