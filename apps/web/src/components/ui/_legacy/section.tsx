/**
 *
 */

import type { HTMLAttributes } from "react"

export function Section({
    children,
    className
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <section
            className={`flex h-dvh flex-col items-center justify-center gap-8 px-4 ${className}`}
        >
            {children}
        </section>
    )
}
