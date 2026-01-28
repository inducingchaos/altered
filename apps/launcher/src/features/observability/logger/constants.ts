/**
 *
 */

/**
 * @remarks Could expand to include `console.dir`, etc.
 */
export const consoleLogTypes = ["log", "info", "warn", "error"] as const
export type ConsoleLogType = (typeof consoleLogTypes)[number]

export const logLevels = ["debug", "info", "warn", "error", "quiet"] as const
export type LogLevel = (typeof logLevels)[number]

export const logTypeToLogLevel = {
    log: "debug",
    info: "info",
    warn: "warn",
    error: "error"
} as const satisfies Record<ConsoleLogType, LogLevel>

export const logLevelWeights = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    quiet: 100
} as const satisfies Record<LogLevel, number>

/**
 * @remarks Can be adjusted as our needs evolve.
 */
export type LogOptions = {
    scope?: string
    title?: string
    description?: string
    data?: Record<string, unknown>
}

/**
 * @remarks Used by our "~/config" schema.
 */
export type LogPartsConfig = {
    timestamp?: boolean
    level?: boolean
    scope?: boolean
    title?: boolean
    description?: boolean
    data?: boolean
}

export type LoggerConfig = {
    parts?: LogPartsConfig
    defaults?: LogOptions
    filter?: {
        level?: LogLevel
        search?: string
    }
    plugins?: LoggerPluginFactoryResult[]
}

export type LoggerPluginOptions<
    PluginOptions extends Record<string, unknown> = Record<string, unknown>
> = PluginOptions
export type LoggerPluginProps<
    PluginOptions extends LoggerPluginOptions = LoggerPluginOptions,
    Hydrated extends boolean = false
> = {
    logOptions?: LogOptions
    logType: ConsoleLogType
    loggerConfig: LoggerConfig
} & (Hydrated extends true
    ? Record<string, unknown>
    : { pluginOptions: PluginOptions })

/**
 * @remarks If we need to return any data to the logger from the plugin for additional logging capabilities, we can extend this to include a result type. Since plugins are defined in an array, we cannot carry any generics - so the result *should* be adapted to a universal value used by the logger. Alternatively, we will can add plugin-specific code within the logger to handle the result, and the specific result type will have to be cast based on the plugin identifier.
 */
export type LoggerPluginHandlerResult = Promise<void> | void

export type LoggerPluginHandler<
    PluginOptions extends LoggerPluginOptions = LoggerPluginOptions,
    Hydrated extends boolean = false
> = (
    options: LoggerPluginProps<PluginOptions, Hydrated>
) => LoggerPluginHandlerResult

export type LoggerPlugin<
    PluginOptions extends LoggerPluginOptions = LoggerPluginOptions,
    Hydrated extends boolean = false
> = {
    id: string
    handle: LoggerPluginHandler<PluginOptions, Hydrated>
}

export type LoggerPluginFactoryResult<
    PluginOptions extends LoggerPluginOptions = LoggerPluginOptions
> = LoggerPlugin<PluginOptions, true> | null

/**
 * @remarks We can't pass `PluginOptions` to `LoggerPluginFactoryResult` because the specificity creates a type error when configuring in the `LoggerConfig["plugins"]` array. This is an "existential types" issue.
 *
 * @see https://stackoverflow.com/questions/51879601/how-do-you-define-an-array-of-generics-in-typescript
 */
export type LoggerPluginFactory<
    PluginOptions extends LoggerPluginOptions = LoggerPluginOptions
> = (options?: PluginOptions) => LoggerPluginFactoryResult
