/**
 * Accessor type utilities for order-independent key matching
 */

import type { SameElements } from "./permutations"

/**
 * Normalizes an array of keys by sorting them
 * This enables order-independent comparison
 */
export function normalizeKeys(keys: readonly string[]): string {
    return [...keys].sort().join("|")
}

/**
 * Checks if two accessor arrays contain the same keys (order-independent)
 */
export function keysMatch(keys1: readonly string[], keys2: readonly string[]): boolean {
    if (keys1.length !== keys2.length) return false
    return normalizeKeys(keys1) === normalizeKeys(keys2)
}

/**
 * Type-level check for duplicate accessors
 * Checks if any two config values have the same keys (order-independent)
 */
export type DetectDuplicates<T extends readonly ConfigValue[], Index extends number = 0> = Index extends T["length"] ? false : T[Index] extends ConfigValue ? CheckAgainstRest<T, Index, Index> : false

/**
 * Checks if the element at Index matches any subsequent elements
 */
type CheckAgainstRest<T extends readonly ConfigValue[], Index extends number, CheckIndex extends number> = CheckIndex extends T["length"] ? DetectDuplicates<T, Add<Index>> : Index extends CheckIndex ? CheckAgainstRest<T, Index, Add<CheckIndex>> : T[Index] extends ConfigValue ? (T[CheckIndex] extends ConfigValue ? (SameElements<T[Index]["keys"], T[CheckIndex]["keys"]> extends true ? true : CheckAgainstRest<T, Index, Add<CheckIndex>>) : CheckAgainstRest<T, Index, Add<CheckIndex>>) : CheckAgainstRest<T, Index, Add<CheckIndex>>

/**
 * Adds 1 to a number type (up to reasonable limits)
 */
type Add<N extends number> = N extends 0 ? 1 : N extends 1 ? 2 : N extends 2 ? 3 : N extends 3 ? 4 : N extends 4 ? 5 : N extends 5 ? 6 : N extends 6 ? 7 : N extends 7 ? 8 : N extends 8 ? 9 : N extends 9 ? 10 : number

import type { ConfigValue } from "../core/types"
