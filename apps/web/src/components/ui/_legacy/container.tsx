/**
 *
 */

import { HTMLAttributes } from "react"

export function Container({ children, className }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`min-h-dvh ${className}`}>{children}</div>
}
