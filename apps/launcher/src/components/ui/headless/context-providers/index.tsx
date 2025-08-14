/**
 *
 */

import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "../../../../lib/networking/client"

export function ContextProvider({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
