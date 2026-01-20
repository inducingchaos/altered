/**
 *
 */

import { QueryClientProvider } from "@tanstack/react-query"
import { MutationQueueProvider } from "app/commands/view-thoughts/mutation-queue-provider"
import { type ComponentType, type ReactNode, useState } from "react"
import { AuthProvider } from "~/auth"
import { createQueryClient } from "../../api"

export function ContextProvider(props: { children: ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MutationQueueProvider>{props.children}</MutationQueueProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export function withContext<Props extends object>(
    Component: ComponentType<Props>
) {
    return function WithContext(props: Props) {
        return (
            <ContextProvider>
                <Component {...props} />
            </ContextProvider>
        )
    }
}
