/**
 *
 */

"use client"

// biome-ignore lint/performance/noNamespaceImport: Recommended pattern - used to categorically group imports from a module.
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import type { ComponentProps } from "react"

function AspectRatio({
    ...props
}: ComponentProps<typeof AspectRatioPrimitive.Root>) {
    return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
