/**
 *
 */

import type { HTMLAttributes } from "react"

export function P({
    children,
    className
}: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={`max-w-2xl text-center text-[#808080] md:text-lg ${className}`}
        >
            {children}
        </p>
    )
}
