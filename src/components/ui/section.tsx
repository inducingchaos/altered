/**
 *
 */

import { HTMLAttributes } from "react"

export function Section({ children }: HTMLAttributes<HTMLDivElement>) {
    return <section className="h-dvh flex flex-col items-center justify-center gap-8">{children}</section>
}
