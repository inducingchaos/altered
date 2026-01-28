/**
 * @todo [P4] Duplicate of util in @altered/harness - resolve.
 */

import { ORPCError } from "@orpc/contract"

/**
 * @remarks AbortErrors are expected when React Query cancels queries.
 */
const isAbortError = (error: unknown): boolean => {
    if (error instanceof Error && error.name === "AbortError") return true
    if (
        error instanceof Error &&
        error.cause instanceof Error &&
        error.cause.name === "AbortError"
    )
        return true

    return false
}

export function createOrpcErrorLogger({
    enable,
    preset
}: {
    enable: boolean
    preset: "client" | "server"
}) {
    if (!enable) return () => undefined

    return (error: unknown) => {
        if (isAbortError(error)) return

        let errorResult: ORPCError<string, unknown> | undefined

        const isOrpcError = error instanceof ORPCError
        if (isOrpcError) errorResult = error

        if (!isOrpcError) {
            const isError = error instanceof Error

            const errorOptions = isError
                ? {
                      message: error.message,
                      cause: error.cause
                  }
                : {
                      message: "Unknown error occurred."
                  }

            errorResult = new ORPCError("INTERNAL_SERVER_ERROR", errorOptions)
        }

        if (!errorResult) return

        /**
         * @remarks Certain data types like `Headers` re-throw an error when logged, so we need to guard against them. Serializing the object inline prevents `[Object object]` (console only displays 1 level deep), and `\n` characters by not using indentation.
         */
        const safeCause =
            errorResult.cause instanceof Object
                ? JSON.stringify(errorResult.cause)
                : String(errorResult.cause)

        const includeErrorCause = preset === "server"
        const logData = includeErrorCause
            ? { ...errorResult.toJSON(), cause: safeCause }
            : errorResult.toJSON()

        console.error("[ERROR] ORPCError:", logData)
    }
}
