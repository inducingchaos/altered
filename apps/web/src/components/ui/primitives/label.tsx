/**
 *
 */

"use client"

// biome-ignore lint/performance/noNamespaceImport: Recommended pattern - used to categorically group imports from a module.
import * as LabelPrimitive from "@radix-ui/react-label"
import type { ComponentProps } from "react"
import { cn } from "~/utils/ui"

function Label({
    className,
    ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            className={cn(
                "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
                className
            )}
            data-slot="label"
            {...props}
        />
    )
}

export { Label }
