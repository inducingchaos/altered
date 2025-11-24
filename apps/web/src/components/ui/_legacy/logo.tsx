/**
 *
 */

import { HTMLAttributes } from "react"

export function Logo({ children, className }: HTMLAttributes<HTMLHeadingElement>) {
    return <h1 className={`text-xl font-mono font-bold tracking-tight ${className}`}>{children}</h1>
}
