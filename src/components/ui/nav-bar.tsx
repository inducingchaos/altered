/**
 *
 */

import { HTMLAttributes } from "react"

export function NavBar({ children }: HTMLAttributes<HTMLDivElement>) {
    return (
        <header className="fixed top-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between h-16 bg-background/75 border-2 border-foreground/12.5 space-between backdrop-blur-sm">{children}</div>
        </header>
    )
}
