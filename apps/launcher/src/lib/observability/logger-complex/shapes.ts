/**
 *
 */

import { OverrideObjectPropsWithNonNullable } from "~/utils/types"

export const logLevels = ["debug", "info", "warn", "error", "silent"] as const
export type LogLevel = (typeof logLevels)[number]

export const logComponentKeys = ["timestamp", "level", "scope", "title", "description", "data"] as const
export type LogComponentKey = (typeof logComponentKeys)[number]

/**
 * @remarks We should refine this to better distinguish between definition constraints (type error when not allowed) and runtime visibility (should it be printed out).
 */
export const systemLogComponentVisibilityOptions = ["always", "never"] as const
export const logComponentVisibilityOptions = [...systemLogComponentVisibilityOptions, "optional"] as const
export type LogComponentVisibilityOptions = (typeof logComponentVisibilityOptions)[number]
export type LogComponentsVisibilityOptions = Record<LogComponentKey, LogComponentVisibilityOptions>

export const defaultLogComponentsVisibilityBase = {
    timestamp: "always",
    level: "always",
    scope: "optional",
    title: "optional",
    description: "optional",
    data: "optional"
} satisfies LogComponentsVisibilityOptions

export const mockAppConfig = {
    logLevel: "debug",
    logComponents: {
        timestamp: "always",
        level: "always",
        scope: "optional",
        title: "optional",
        description: "optional",
        data: "optional"
    }
} as const

/**
 * @remarks When we make this more portable, we should be able to pass the config object in a simpler initializer.
 */
export const defaultLogComponentsVisibility = {
    ...defaultLogComponentsVisibilityBase,
    ...mockAppConfig.logComponents
} satisfies LogComponentsVisibilityOptions

/**
 * @remarks Ideally we shouldn't need to import `configDef` but it gives us access to the original literal value types. (In most situations, we wouldn't want this, it's better to see all the available config options as a union - but here, we want to infer exactly what was typed.)
 */
export type DefaultLogComponentsVisibility = OverrideObjectPropsWithNonNullable<typeof defaultLogComponentsVisibilityBase, typeof mockAppConfig.logComponents>

export const logLevelWeight: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 100
}
