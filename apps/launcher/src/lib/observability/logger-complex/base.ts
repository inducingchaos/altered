/**
 * @todo [P4] Review and refactor.
 */

import { Expand } from "~/utils/types"
import { defaultLogComponentsVisibility, DefaultLogComponentsVisibility, logComponentKeys, LogComponentsVisibilityOptions, LogComponentVisibilityOptions, LogLevel, logLevelWeight, mockAppConfig } from "./shapes"

type ValueMap = {
    scope?: string | null
    title: string
    description: string
    data: unknown
}

type RequiredKeys<C extends LogComponentsVisibilityOptions> = {
    [K in keyof C]: C[K] extends "always" ? K : never
}[keyof C]

type OptionalKeys<C extends LogComponentsVisibilityOptions> = {
    [K in keyof C]: C[K] extends "optional" ? K : never
}[keyof C]

type AllowedKeys<C extends LogComponentsVisibilityOptions> = {
    [K in keyof C]: C[K] extends "never" ? never : K
}[keyof C]

type LogMessage<VisibilityConfig extends LogComponentsVisibilityOptions> = Expand<
    {
        [K in RequiredKeys<VisibilityConfig> & keyof ValueMap]: ValueMap[K]
    } & {
        [K in OptionalKeys<VisibilityConfig> & keyof ValueMap]?: ValueMap[K]
    } & {
        [K in Exclude<AllowedKeys<VisibilityConfig>, keyof ValueMap>]?: never
    }
>

type LogValues<C extends LogComponentsVisibilityOptions> = {
    [K in RequiredKeys<C> & keyof ValueMap]: ValueMap[K]
} & {
    [K in OptionalKeys<C> & keyof ValueMap]?: ValueMap[K]
} & {
    [K in Exclude<AllowedKeys<C>, keyof ValueMap>]?: never
}

type LoggerInit<C extends LogComponentsVisibilityOptions> = {
    level?: LogLevel
    components?: Partial<LogComponentsVisibilityOptions>
    defaults?: Partial<LogValues<C>>
    filter?: string
}

const formatTimestamp = (date: Date) => date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })

class Logger<C extends LogComponentsVisibilityOptions> {
    private readonly defaults: LoggerInit<C>["defaults"]
    private readonly components: LogComponentsVisibilityOptions
    private readonly filterTerms?: string[]
    private readonly level: LogLevel

    constructor(init?: LoggerInit<C>) {
        this.defaults = init?.defaults ?? {}
        this.components = this.mergeComponents(init?.components)
        const configuredFilter = (mockAppConfig as { logFilter?: string }).logFilter
        const filter = init?.filter ?? configuredFilter
        this.filterTerms = filter ? this.splitFilter(filter) : undefined
        this.level = init?.level ?? mockAppConfig.logLevel
    }

    debug(message: LogMessage<C>) {
        this.emit("debug", message)
    }

    info(message: LogMessage<C>) {
        this.emit("info", message)
    }

    warn(message: LogMessage<C>) {
        this.emit("warn", message)
    }

    error(message: LogMessage<C>) {
        this.emit("error", message)
    }

    private emit(level: LogLevel, message: LogMessage<C>) {
        const normalizedLevel = this.normalizeLevel(level)
        const configuredLevel = this.normalizeLevel(this.level)

        if (!this.shouldLog(normalizedLevel, configuredLevel)) return

        const activeComponents = this.resolveComponents()
        const { line, data } = this.buildLine(normalizedLevel, message, activeComponents)

        if (this.filterTerms && !this.matchesFilter(line, data)) return

        this.output(normalizedLevel, line, data, activeComponents)
    }

    private normalizeLevel(level: LogLevel): LogLevel {
        return level
    }

    private shouldLog(level: LogLevel, configuredLevel: LogLevel) {
        return logLevelWeight[level] >= logLevelWeight[configuredLevel] && configuredLevel !== "silent"
    }

    private resolveComponents(override?: Partial<LogComponentsVisibilityOptions>): LogComponentsVisibilityOptions {
        return {
            ...defaultLogComponentsVisibility,
            ...this.components,
            ...(override ?? {})
        }
    }

    private buildLine(level: LogLevel, message: LogMessage<C>, components: LogComponentsVisibilityOptions) {
        const defaults = this.defaults ?? {}
        const scope = "scope" in message ? (message.scope === null ? undefined : message.scope) : "scope" in defaults ? defaults.scope : undefined
        const title = "title" in message ? (message.title === null ? undefined : message.title) : "title" in defaults ? defaults.title : undefined
        const description = "description" in message ? (message.description === null ? undefined : message.description) : "description" in defaults ? defaults.description : undefined
        const data = "data" in message ? (message.data === null ? undefined : message.data) : "data" in defaults ? defaults.data : undefined

        const parts: string[] = []

        if (components.timestamp !== "never") parts.push(formatTimestamp(new Date()))
        if (components.level !== "never") parts.push(`[${level.toUpperCase()}]`)
        if (components.scope !== "never" && scope) parts.push(`[${scope}]`)

        const showTitle = components.title !== "never" && Boolean(title)
        const showDescription = components.description !== "never" && Boolean(description)

        if (showTitle && showDescription) {
            parts.push(`${title}:`, description as string)
        } else {
            if (showTitle) parts.push(title as string)
            if (showDescription) parts.push(description as string)
        }

        return { line: parts.join(" "), data, scope, title, description }
    }

    private matchesFilter(line: string, data: unknown) {
        if (!this.filterTerms) return true
        const serializedData = data !== undefined ? this.safeStringify(data) : ""
        const target = `${line} ${serializedData}`.trim()
        return this.filterTerms.every(term => target.includes(term))
    }

    private splitFilter(filter: string) {
        return filter
            .split(/\s+/)
            .map(part => part.trim())
            .filter(Boolean)
    }

    private safeStringify(value: unknown) {
        try {
            return typeof value === "string" ? value : JSON.stringify(value)
        } catch {
            return String(value)
        }
    }

    private output(level: LogLevel, line: string, data: unknown, components: LogComponentsVisibilityOptions) {
        const emitter = this.selectConsole(level)

        if (components.data !== "never" && data !== undefined) {
            emitter(line, data)
        } else {
            emitter(line)
        }
    }

    private selectConsole(level: LogLevel) {
        switch (level) {
            case "debug":
                return console.debug.bind(console)
            case "info":
                return console.info.bind(console)
            case "warn":
                return console.warn.bind(console)
            case "error":
            default:
                return console.error.bind(console)
        }
    }

    private mergeComponents(components?: Partial<LogComponentsVisibilityOptions>): LogComponentsVisibilityOptions {
        const fromConfig = mockAppConfig.logComponents ?? {}

        return logComponentKeys.reduce((acc, key) => {
            const configured = (fromConfig as Partial<LogComponentsVisibilityOptions>)[key]
            const override = components?.[key]
            acc[key] = override ?? configured ?? defaultLogComponentsVisibility[key]
            return acc
        }, {} as LogComponentsVisibilityOptions)
    }
}

export function createLogger<Override extends Partial<LogComponentsVisibilityOptions> = Partial<DefaultLogComponentsVisibility>>(init?: LoggerInit<MergeComponents<DefaultLogComponentsVisibility, Override>> & { components?: Override }): Logger<MergeComponents<DefaultLogComponentsVisibility, Override>> {
    return new Logger<MergeComponents<DefaultLogComponentsVisibility, Override>>({
        ...(init ?? {})
        // components: init?.components as Partial<LogComponentsVisibilityOptions>
    })
}

/**
 * @remarks Replaced.
 */
type MergeComponents<Base extends LogComponentsVisibilityOptions, Override extends Partial<LogComponentsVisibilityOptions>> = {
    [K in keyof Base]: K extends keyof Override ? NonNullable<Override[K]> : Base[K]
}

export type LoggerInstance = Logger<DefaultLogComponentsVisibility>

export const log: LoggerInstance = createLogger()

export type { DefaultLogComponentsVisibility, LogComponentsVisibilityOptions, LogComponentVisibilityOptions, LoggerInit, LogMessage }

export * from "./shapes"
