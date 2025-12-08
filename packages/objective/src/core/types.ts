/**
 * Core types for config value definitions
 */

import type { z } from "zod"

/**
 * Environment scope for a config value
 * - undefined = both server and client
 * - "server" = server-only (code-split from client)
 * - "client" = client-only
 */
export type Environment = "server" | "client"

/**
 * A single config value definition
 *
 * TKeys should be a readonly tuple of string literals (e.g., ["a", "b"] as const)
 * to enable proper type inference and order-independent matching.
 */
export type ConfigValue<TKeys extends readonly string[] = readonly string[], TValue = unknown, TValidator extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined> = {
    /** Array of keys that identify this config value (order-independent) - use `as const` to preserve literal types */
    readonly keys: TKeys
    /** Optional environment scope (undefined = both) */
    readonly environment?: Environment
    /** Optional Zod validator schema */
    readonly validator?: TValidator
    /** The actual value */
    readonly value: TValue
}

/**
 * Type helper to extract the value type from a config value
 */
export type ConfigValueType<T extends ConfigValue> = T extends ConfigValue<any, infer TValue, infer TValidator> ? (TValidator extends z.ZodTypeAny ? z.infer<TValidator> : TValue) : never

/**
 * Type helper to extract keys from a config value
 */
export type ConfigValueKeys<T extends ConfigValue> = T["keys"]

/**
 * A complete config definition (array of config values)
 */
export type ConfigDefinition = readonly ConfigValue[]
