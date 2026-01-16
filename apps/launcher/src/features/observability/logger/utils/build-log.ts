/**
 *
 */

import {
    type ConsoleLogType,
    type LoggerConfig,
    type LogOptions,
    logTypeToLogLevel
} from "../constants"
import { serializeDataEntries } from "./serialize-entries"
import { formatTimestamp } from "./timestamp"

export function buildLog({
    logOptions,
    logType,
    loggerConfig,
    extras
}: {
    logType: ConsoleLogType
    loggerConfig?: LoggerConfig
    logOptions?: LogOptions
    extras?: { includeDateInTimestamp?: boolean; stringifyData?: boolean }
}) {
    const { includeDateInTimestamp = true, stringifyData = true } = {
        ...extras
    }

    const defaultedLogOptions = {
        ...loggerConfig?.defaults,
        ...logOptions
    }

    const parts: string[] = []

    if (loggerConfig?.parts?.timestamp !== false)
        parts.push(
            formatTimestamp({
                date: new Date(),
                include: { date: includeDateInTimestamp }
            })
        )
    if (loggerConfig?.parts?.level !== false)
        parts.push(`[${logTypeToLogLevel[logType].toUpperCase()}]`)
    if (loggerConfig?.parts?.scope !== false && defaultedLogOptions.scope)
        parts.push(`[${defaultedLogOptions.scope}]`)
    if (loggerConfig?.parts?.title !== false && defaultedLogOptions.title)
        parts.push(
            `${defaultedLogOptions.title}${defaultedLogOptions.title && defaultedLogOptions.description ? ":" : ""}`
        )
    if (
        loggerConfig?.parts?.description !== false &&
        defaultedLogOptions.description
    )
        parts.push(defaultedLogOptions.description as string)

    if (stringifyData && defaultedLogOptions.data)
        parts.push(
            JSON.stringify(
                serializeDataEntries({ data: defaultedLogOptions.data })
            )
        )

    return parts.join(" ")
}
