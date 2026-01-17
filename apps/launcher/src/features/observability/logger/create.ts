/**
 *
 */

import {
    type ConsoleLogType,
    consoleLogTypes,
    type LoggerConfig,
    type LogOptions
} from "./constants"
import {
    buildLog,
    matchesSearch,
    mergeLoggerConfig,
    serializeDataEntries,
    shouldLogAtLevel
} from "./utils"

const handlePlugins = ({
    logOptions,
    logType,
    loggerConfig
}: {
    logOptions?: LogOptions
    logType: ConsoleLogType
    loggerConfig?: LoggerConfig
}) => {
    if (loggerConfig?.plugins) {
        for (const plugin of loggerConfig.plugins) {
            if (!plugin) continue

            if (plugin.id === "log-to-file") {
                //  We can use the plugin ID to add plugin-specific logic to the logger.
                //  It should be possible to type `plugin.id` as a union of all of the plugin IDs (not worth it atm). Since we only barrel export from "logger/plugins/index.ts", we will either have to register/aggregate all of the plugins into an object in that file, or (if possible) collect the exports from the module and use them to derive the `PluginID` union type - then pass the union as a generic parameter to the `LoggerConfig["plugins"]` type. Passing `PluginID` to a more primitive type could create a circular reference, however we may need generics on the primitives to keep the ID as a string literal.
                // console.log(`Initiating plugin: ${plugin.id}`)
            }

            plugin.handle({ logOptions, logType, loggerConfig })
        }
    }
}

const createLoggerMethod = ({
    logType,
    loggerConfig
}: {
    logType: ConsoleLogType
    loggerConfig?: LoggerConfig
}) => {
    return (logOptions?: LogOptions) => {
        handlePlugins({ logOptions, logType, loggerConfig })

        if (
            loggerConfig?.filter?.level &&
            !shouldLogAtLevel({
                logType,
                logLevel: loggerConfig?.filter.level
            })
        )
            return

        const log = buildLog({
            logOptions,
            logType,
            loggerConfig,
            extras: {
                stringifyData: false,
                includeDateInTimestamp: false
            }
        })

        if (
            loggerConfig?.filter?.search &&
            !matchesSearch({
                text: log,
                query: loggerConfig?.filter.search
            })
        )
            return

        const logData = logOptions?.data
            ? serializeDataEntries({ data: logOptions.data })
            : undefined

        const args = [log, logData].filter(Boolean)
        console[logType](...args)
    }
}

export function createLogger(loggerConfig?: LoggerConfig) {
    const consoleMethods = Object.fromEntries(
        consoleLogTypes.map(logType => [
            logType,

            createLoggerMethod({ logType, loggerConfig })
        ])
    )

    return {
        ...(consoleMethods as Record<
            ConsoleLogType,
            (typeof consoleMethods)[ConsoleLogType]
        >),

        configure: (overrideConfig?: LoggerConfig) =>
            createLogger(mergeLoggerConfig(loggerConfig, overrideConfig))
    }
}
