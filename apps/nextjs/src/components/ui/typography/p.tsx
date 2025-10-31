/**
 *
 */

import { HTMLAttributes } from "react"

export function P({ children }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className="md:text-lg text-center text-[#808080] max-w-2xl">{children}</p>
}
