/**
 *
 */

"use client"

// biome-ignore lint/performance/noNamespaceImport: Recommended pattern - used to categorically group imports from a module.
import * as ProgressPrimitive from "@radix-ui/react-progress"
import type { ComponentProps } from "react"
import { cn } from "~/utils/ui"

function Progress({
    className,
    value,
    ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
                className
            )}
            data-slot="progress"
            {...props}
        >
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-primary transition-all"
                data-slot="progress-indicator"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}

export { Progress }
