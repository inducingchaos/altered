/**
 *
 */

import { HTMLAttributes } from "react"

export function Wrapper({ children, className }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`flex flex-col items-center justify-center ${className}`}>{children}</div>
}
