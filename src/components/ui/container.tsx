/**
 *
 */

import { HTMLAttributes } from "react"

export function Container({ children }: HTMLAttributes<HTMLDivElement>) {
    return <div className="min-h-dvh">{children}</div>
}
