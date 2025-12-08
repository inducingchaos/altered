/**
 * Client-safe config accessor
 * Filters out server-only values for client bundles
 */

import { filterByEnvironment } from "./environment"
import { createGetFunction } from "./get-value"
import type { ConfigDefinition, ConfigValue } from "./types"

/**
 * Creates a client-safe config that excludes server-only values
 */
export function createClientConfig<TDefinition extends ConfigDefinition>(definition: TDefinition) {
    // Filter out server-only values
    const clientDefinition = filterByEnvironment(definition, "client")

    // Create get function for client-safe config
    const get = createGetFunction(clientDefinition)

    return {
        get,
        definition: clientDefinition as unknown as TDefinition
    }
}

