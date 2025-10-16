/**
 *
 */

import { HTMLAttributes } from "react"

export function H1({ children }: HTMLAttributes<HTMLHeadingElement>) {
    return <h1 className="md:text-6xl font-bold text-center">{children}</h1>
}
