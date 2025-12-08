/**
 * Main config factory function
 */

import { checkDuplicates, findConfigValue } from "./accessor"
import { createGetFunction } from "./get-value"
import { isClient, isServer, validateEnvironmentAccess } from "./environment"
import type { ConfigDefinition, ConfigValue } from "./types"
import type { z } from "zod"

/**
 * Creates a config instance from a definition array
 *
 * The definition should use `as const` to preserve literal tuple types for keys.
 * Duplicate key sets (even in different orders) will be detected at runtime.
 *
 * Note: Type-level duplicate detection exists but is disabled due to TypeScript
 * recursion limits. Runtime checking via `checkDuplicates` will catch duplicates.
 */
export function createConfig<TDefinition extends ConfigDefinition>(definition: TDefinition) {
    // Check for duplicates at creation time
    checkDuplicates(definition)

    // Validate all config values with their validators
    for (const item of definition) {
        if (item.validator) {
            const result = item.validator.safeParse(item.value)
            if (!result.success) {
                throw new Error(`Config validation failed for keys [${item.keys.join(", ")}]: ${result.error.message}`)
            }
        }
    }

    // Create the get function
    const get = createGetFunction(definition)

    // Enhanced get function with environment validation
    const getWithEnv = <TKeys extends readonly string[]>(...keys: TKeys): ReturnType<typeof get> => {
        const found = findConfigValue(definition, keys)
        if (!found) {
            return get(...keys)
        }

        // Validate environment access
        const currentEnv = isServer() ? "server" : "client"
        validateEnvironmentAccess(found, currentEnv)

        return get(...keys)
    }

    return {
        get: getWithEnv,
        definition
    }
}
