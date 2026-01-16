/**
 *
 */

import type { HTMLAttributes } from "react"

export function H1({
    children,
    className
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={`text-center font-bold text-4xl md:text-6xl ${className}`}
        >
            {children}
        </h1>
    )
}
