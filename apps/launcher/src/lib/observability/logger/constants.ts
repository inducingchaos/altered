/**
 *
 */

import { z } from "zod"

export const consoleLogTypes = ["log", "info", "warn", "error"] as const
export type ConsoleLogType = (typeof consoleLogTypes)[number]

export const logLevels = ["debug", "info", "warn", "error", "silent"] as const
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
    silent: 100
} as const satisfies Record<LogLevel, number>

/**
 * @remarks This schema can be adjusted as our needs evolve.
 */
export const logSchema = z.object({
    scope: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    data: z.record(z.string(), z.unknown()).optional()
})
export type LogSchema = z.infer<typeof logSchema>

export const logComponentsConfigSchema = z.object({
    timestamp: z.boolean().optional(),
    level: z.boolean().optional(),
    scope: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    data: z.boolean().optional()
})
export type LogComponentsConfigSchema = z.infer<typeof logComponentsConfigSchema>

export const logConfigSchema = z.object({
    components: logComponentsConfigSchema.optional(),
    defaults: logSchema.optional(),
    filter: z
        .object({
            level: z.enum(logLevels).optional(),
            search: z.string().optional()
        })
        .optional()
})
export type LogConfigSchema = z.infer<typeof logConfigSchema>
