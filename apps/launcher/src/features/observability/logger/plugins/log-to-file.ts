/**
 *
 */

import { appendFile, mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import type { LoggerPlugin, LoggerPluginFactory } from "../constants"
import { buildLog } from "../utils"

type LogToFilePluginOptions = {
    enabled?: boolean
    cwd?: string
    relativePath?: string
}

const logToFilePlugin: LoggerPlugin<LogToFilePluginOptions> = {
    id: "log-to-file",

    handle: async ({ logOptions, logType, loggerConfig, pluginOptions }) => {
        try {
            const logFilePath = join(
                pluginOptions.cwd ?? process.cwd(),
                pluginOptions.relativePath ?? "./.logs/app.log"
            )

            try {
                await mkdir(dirname(logFilePath), { recursive: true })
            } catch {
                //  Directory already exists or creation failed, continue anyway.
            }

            const logLine = buildLog({
                logOptions,
                logType,
                loggerConfig: {
                    ...loggerConfig,
                    parts: {
                        timestamp: true,
                        level: true,
                        scope: true,
                        title: true,
                        description: true,
                        data: true
                    }
                }
            })

            await appendFile(logFilePath, `${logLine}\n`, "utf-8")
        } catch (error) {
            console.error(error)
        }
    }
}

/**
 * @remarks Do we even need a factory? Sure, it allows us to "not run" a plugin, which also requires us to return null - but we're basically just forwarding props. We could always no-op inside the plugin itself.
 */
export const logToFile: LoggerPluginFactory<
    LogToFilePluginOptions
> = pluginOptions => {
    if (!pluginOptions?.enabled) return null

    const isNodeEnvironment = typeof process !== "undefined"
    if (!isNodeEnvironment) return null

    return {
        ...logToFilePlugin,

        handle: pluginProps =>
            logToFilePlugin.handle({
                ...pluginProps,
                pluginOptions
            })
    }
}
