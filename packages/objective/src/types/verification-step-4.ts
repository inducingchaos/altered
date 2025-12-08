/**
 * VERIFICATION STEP 4: createConfig Type Inference
 *
 * Purpose: Verify that createConfig properly infers key types as literal tuples
 * and detects duplicates.
 *
 * What to check:
 * - Keys in config should be inferred as ["a", "b"], not string[]
 * - Duplicate keys should cause a type error
 * - The get function should have proper type inference
 */

import { createConfig } from "../core/create-config"
import { z } from "zod"

// Test 1: Proper key inference
// Hover over 'keys' in the config - should be ["test", "key"], NOT string[]
const test1 = createConfig([
    {
        keys: ["test", "key"] as const,
        validator: z.string(),
        value: "test-value"
    }
] as const)

// Test 2: Duplicate detection
// This should ERROR once duplicate detection is implemented
const test2 = createConfig([
    {
        keys: ["a", "b"] as const,
        value: "first"
    },
    {
        keys: ["b", "a"] as const, // Same keys, different order - should error
        value: "second"
    }
] as const)

// Test 3: Type-safe get function
// Hover over result - should be string (from validator), not unknown
const test3 = createConfig([
    {
        keys: ["feature", "enabled"] as const,
        validator: z.boolean(),
        value: true
    }
] as const)

// This should be inferred as boolean, not unknown
const result = test3.get("feature", "enabled")

export type VerificationStep4 = {
    test1: typeof test1
    test2: typeof test2
    test3: typeof result
}
