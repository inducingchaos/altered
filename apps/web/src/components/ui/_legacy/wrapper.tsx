/**
 *
 */

import type { HTMLAttributes } from "react"

export function Wrapper({
    children,
    className
}: HTMLAttributes<HTMLDivElement>) {
    return <div className={`flex items-center ${className}`}>{children}</div>
}
