/**
 *
 */

import type { HTMLAttributes } from "react"

export function NavBar({
    children,
    className
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <header className={`fixed top-0 right-0 left-0 p-4 ${className}`}>
            <div className="space-between flex h-16 items-center justify-between border-2 border-foreground/12.5 bg-background/75 backdrop-blur-sm">
                {children}
            </div>
        </header>
    )
}
