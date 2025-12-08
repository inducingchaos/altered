/**
 * Accessor resolution logic for order-independent key matching
 */

import { keysMatch, normalizeKeys } from "../types/accessor"
import type { ConfigValue } from "./types"

/**
 * Finds a config value by its keys (order-independent)
 */
export function findConfigValue<T extends ConfigValue>(
    config: readonly T[],
    searchKeys: readonly string[]
): T | undefined {
    return config.find((item) => keysMatch(item.keys, searchKeys))
}

/**
 * Validates that all search keys exist in the config
 */
export function validateAccessor(
    config: readonly ConfigValue[],
    searchKeys: readonly string[]
): void {
    const found = findConfigValue(config, searchKeys)
    if (!found) {
        const normalized = normalizeKeys(searchKeys)
        throw new Error(
            `Config value not found for keys: [${searchKeys.join(", ")}] (normalized: ${normalized})`
        )
    }
}

/**
 * Checks for duplicate accessors in a config definition
 */
export function checkDuplicates(config: readonly ConfigValue[]): void {
    const seen = new Set<string>()
    for (const item of config) {
        const normalized = normalizeKeys(item.keys)
        if (seen.has(normalized)) {
            throw new Error(
                `Duplicate config value detected for keys: [${item.keys.join(", ")}] (normalized: ${normalized})`
            )
        }
        seen.add(normalized)
    }
}

