/**
 *
 */

import type { HTMLAttributes } from "react"

export function Logo({
    children,
    className
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={`font-bold font-mono text-xl tracking-tight ${className}`}
        >
            {children}
        </h1>
    )
}
