/**
 *
 */

import type { LoggerLinkOptions } from "@trpc/client"

import type { AppRouter } from "@altered/api"

type CustomLoggerFnType = NonNullable<LoggerLinkOptions<AppRouter>["logger"]>
type CustomLoggerOptsType = Parameters<CustomLoggerFnType>[0]

/**
 * Needs cleaning, but works.
 */
export const customTRPCLogger = (opts: CustomLoggerOptsType) => {
    const { path, type, direction, id, input } = opts
    const directionMarker = direction === "up" ? ">>" : "<<"
    const logPrefix = `${directionMarker} ${type} #${id} ${path}`

    if (direction === "up") {
        console.log(logPrefix, input ? JSON.stringify({ input }, null, 2) : "(no input)")
    } else {
        //  `result` is only available on "down" direction opts.

        const { result } = opts

        if (result instanceof Error) {
            console.error(`${logPrefix} Error:`, JSON.stringify(result, Object.getOwnPropertyNames(result), 2))
        } else if (result && result.result && result.result.type === "data") {
            console.log(`${logPrefix}`, JSON.stringify({ success: true, data: result.result.data }, null, 2))
        } else {
            console.log(`${logPrefix} Result (non-data or error in envelope):`, JSON.stringify(result, null, 2))
        }
    }
}
