/**
 * Value retrieval function with type-safe accessor lookup
 */

import { findConfigValue } from "./accessor"
import type { ConfigValue, ConfigValueType } from "./types"
import type { SameElements } from "../types/permutations"

/**
 * Type helper to find a matching config value by keys (order-independent)
 */
type FindMatchingValue<
    TConfig extends readonly ConfigValue[],
    TKeys extends readonly string[]
> = TConfig extends readonly (infer TItem)[]
    ? TItem extends ConfigValue
        ? SameElements<TItem["keys"], TKeys> extends true
            ? ConfigValueType<TItem>
            : never
        : never
    : never

/**
 * Extracts the return type for a get function call
 * Tries to find a config value whose keys match the search keys (order-independent)
 */
export type GetValueReturn<
    TConfig extends readonly ConfigValue[],
    TKeys extends readonly string[]
> = FindMatchingValue<TConfig, TKeys>

/**
 * Creates a type-safe get function for a config
 */
export function createGetFunction<TConfig extends readonly ConfigValue[]>(
    config: TConfig
) {
    return function get<TKeys extends readonly string[]>(
        ...keys: TKeys
    ): GetValueReturn<TConfig, TKeys> {
        const found = findConfigValue(config, keys)
        if (!found) {
            const normalized = [...keys].sort().join("|")
            throw new Error(
                `Config value not found for keys: [${keys.join(", ")}] (normalized: ${normalized})`
            )
        }

        // Validate if validator exists (should already be validated at creation, but double-check)
        if (found.validator) {
            const result = found.validator.safeParse(found.value)
            if (!result.success) {
                throw new Error(
                    `Config value validation failed for keys [${keys.join(", ")}]: ${result.error.message}`
                )
            }
            return result.data as GetValueReturn<TConfig, TKeys>
        }

        return found.value as GetValueReturn<TConfig, TKeys>
    }
}

