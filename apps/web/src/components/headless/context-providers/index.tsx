/**
 *
 */

"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { createQueryClient } from "~/lib/infra/queries"
import { ThemeProvider } from "./theme"

export function ContextProvider(props: { children: ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {props.children}
            </ThemeProvider>
        </QueryClientProvider>
    )
}
