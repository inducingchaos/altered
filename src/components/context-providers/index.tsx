/**
 *
 */

"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { createQueryClient } from "~/lib/infra/queries"

export function ContextProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}
