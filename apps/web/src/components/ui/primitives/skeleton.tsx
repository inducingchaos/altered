/**
 *
 */

import type { ComponentProps } from "react"
import { cn } from "~/utils/ui"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-accent", className)}
            data-slot="skeleton"
            {...props}
        />
    )
}

export { Skeleton }
