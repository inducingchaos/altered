/**
 *
 */

"use client"

import { useRouter } from "next/navigation"
import { HTMLAttributes } from "react"

export function Button({ className, children, redirectTo = "/" }: HTMLAttributes<HTMLButtonElement> & { redirectTo?: string }) {
    const router = useRouter()

    return (
        <div className={className}>
            <button className="h-10 px-5 bg-foreground text-background font-mono text-sm font-medium hover:opacity-75" onClick={() => (redirectTo ? router.push(redirectTo) : undefined)}>
                {children}
            </button>
        </div>
    )
}
