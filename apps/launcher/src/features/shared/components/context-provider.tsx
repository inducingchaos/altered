/**
 *
 */

import { QueryClientProvider } from "@tanstack/react-query"
import { ComponentType, ReactNode, useState } from "react"
import { createQueryClient } from "../../api"

export function ContextProvider(props: { children: ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

export function withContext<Props extends object>(Component: ComponentType<Props>) {
    return function WithContext(props: Props) {
        return (
            <ContextProvider>
                <Component {...props} />
            </ContextProvider>
        )
    }
}
