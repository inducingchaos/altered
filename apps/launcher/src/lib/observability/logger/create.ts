/**
 * @remarks Does not import primitives from anywhere else in "../logger".
 */

import { config } from "~/config"
import { ConsoleLogType, LogConfigSchema, LogLevel, LogSchema, consoleLogTypes, logLevelWeights, logTypeToLogLevel } from "./constants"

const formatTimestamp = ({ date }: { date: Date }) => date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })

const shouldLogAtLevel = ({ logType, logLevel }: { logType: ConsoleLogType; logLevel: LogLevel }) => {
    if (logLevel === "silent") return false

    const logLevelForType = logTypeToLogLevel[logType]

    return logLevelWeights[logLevelForType] >= logLevelWeights[logLevel]
}

const serializeDataEntries = ({ data }: { data: Record<string, unknown> }) =>
    Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [key, value]
            else
                try {
                    return [key, JSON.stringify(value)]
                } catch {
                    return [key, String(value)]
                }
        })
    )

const matchesNarrowingSearch = ({ text, query }: { text: string; query: string }) => query.split(" ").every(term => text.includes(term))

function buildMessage({ logType, config, props }: { logType: ConsoleLogType; config?: LogConfigSchema; props: LogSchema }) {
    const defaultedProps = {
        ...config?.defaults,
        ...props
    }

    const parts: string[] = []

    if (config?.components?.timestamp !== false) parts.push(formatTimestamp({ date: new Date() }))
    if (config?.components?.level !== false) parts.push(`[${logTypeToLogLevel[logType].toUpperCase()}]`)
    if (config?.components?.scope !== false && defaultedProps.scope) parts.push(`[${defaultedProps.scope}]`)
    if (config?.components?.title !== false && defaultedProps.title) parts.push(`${defaultedProps.title}${defaultedProps.title && defaultedProps.description ? ":" : ""}`)
    if (config?.components?.description !== false && defaultedProps.description) parts.push(defaultedProps.description as string)

    return parts.join(" ")
}

export function createLogger(config?: LogConfigSchema) {
    return Object.fromEntries(
        consoleLogTypes.map(logType => [
            logType,
            ({ data, ...props }: LogSchema) => {
                if (config?.filter?.level && !shouldLogAtLevel({ logType, logLevel: config?.filter.level })) return

                const message = buildMessage({ logType, config, props })

                if (config?.filter?.search && !matchesNarrowingSearch({ text: message, query: config?.filter.search })) return

                const args = [message, data && serializeDataEntries({ data })].filter(Boolean)

                console[logType](...args)
            }
        ])
    ) as Record<ConsoleLogType, (props: LogSchema) => void>
}

export const logger = createLogger({ filter: { level: config.logLevel, search: config.logSearch }, components: config.logComponents })
