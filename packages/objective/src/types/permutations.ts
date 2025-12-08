/**
 * Type utilities for order-independent accessor matching
 *
 * Instead of generating all permutations (computationally expensive),
 * we use a normalized form (sorted tuple) for comparison and duplicate detection.
 * Runtime matching is done by sorting keys and comparing.
 */

/**
 * Converts a tuple to a union of its elements
 */
type TupleToUnion<T extends readonly unknown[]> = T[number]

/**
 * Checks if two tuples contain the same elements (order-independent)
 * by comparing their element unions
 */
export type SameElements<T1 extends readonly string[], T2 extends readonly string[]> = TupleToUnion<T1> extends TupleToUnion<T2> ? (TupleToUnion<T2> extends TupleToUnion<T1> ? (T1["length"] extends T2["length"] ? true : false) : false) : false

/**
 * Normalized key set for duplicate detection
 * This represents the set of keys regardless of order
 */
export type KeySet<T extends readonly string[]> = {
    readonly keys: T
    readonly normalized: string // Runtime: sorted and joined for comparison
}

/**
 * Creates a key set from an array of keys
 */
export type CreateKeySet<T extends readonly string[]> = KeySet<T>
