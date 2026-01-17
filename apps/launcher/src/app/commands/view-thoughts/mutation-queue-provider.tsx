/**
 *
 */

import { createContext, type ReactNode, use, useMemo, useRef } from "react"

type MutationQueueBaseContextValue = {
    /**
     * @remarks Placeholder.
     */
    queue: string[]
}

type MutationQueueLoadingContextValue = MutationQueueBaseContextValue & {
    status: "loading"
}

type MutationQueueSuccessContextValue = MutationQueueBaseContextValue & {
    status: "success"
}

type MutationQueueErrorContextValue = MutationQueueBaseContextValue & {
    status: "error"
}

type MutationQueueContextValue =
    | MutationQueueLoadingContextValue
    | MutationQueueSuccessContextValue
    | MutationQueueErrorContextValue

const MutationQueueContext = createContext<MutationQueueContextValue | null>(
    null
)

export function MutationQueueProvider({ children }: { children: ReactNode }) {
    const queue = useRef<string[]>([])
    const status = useRef<"loading" | "success" | "error">("loading")

    const baseValue: MutationQueueBaseContextValue = useMemo(
        () => ({
            queue: queue.current
        }),
        []
    )

    const value: MutationQueueContextValue = useMemo(() => {
        if (status.current === "loading")
            return {
                ...baseValue,

                status: "loading"
            }

        if (status.current === "success")
            return {
                ...baseValue,

                status: "success"
            }

        if (status.current === "error")
            return {
                ...baseValue,

                status: "error"
            }

        throw new Error(
            "Invalid `MutationQueue` value. This should never happen."
        )
    }, [baseValue])

    return <MutationQueueContext value={value}>{children}</MutationQueueContext>
}

type SafeResult<
    IsSafeResult extends boolean,
    Result
> = IsSafeResult extends true ? Result | null : Result

export function useMutationQueue<
    IsSafeResult extends boolean = false,
    Result = SafeResult<IsSafeResult, MutationQueueContextValue>
>(props?: { safe?: IsSafeResult }): Result {
    const { safe: isSafe = false } = props ?? {}

    const context = use(MutationQueueContext)

    if (!(context || isSafe))
        throw new Error(
            "`useMutationQueue` must be used within a `MutationQueueProvider`."
        )

    return context as Result
}
