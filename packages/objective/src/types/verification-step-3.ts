/**
 * VERIFICATION STEP 3: Duplicate Detection
 *
 * Purpose: Verify that duplicate key sets are detected at the type level,
 * even when keys are in different orders.
 *
 * What to check:
 * - TestDuplicate1 should cause a type error (same keys, different order)
 * - TestDuplicate2 should cause a type error (exact same keys)
 * - TestNoDuplicate should NOT cause a type error (different keys)
 *
 * Note: This will be implemented as a conditional type that errors on duplicates
 */

import type { ConfigValue } from "../core/types"

// This will be used once we implement duplicate detection in createConfig
// For now, this is a placeholder to show what we're testing

// Test 1: Duplicate keys in different order
// This should ERROR once duplicate detection is implemented
const testDuplicate1 = [
    { keys: ["a", "b"] as const, value: "first" },
    { keys: ["b", "a"] as const, value: "second" } // Same keys, different order - should error
] as const

// Test 2: Exact duplicate keys
// This should ERROR once duplicate detection is implemented
const testDuplicate2 = [
    { keys: ["x", "y"] as const, value: "first" },
    { keys: ["x", "y"] as const, value: "second" } // Exact duplicate - should error
] as const

// Test 3: No duplicates
// This should NOT error
const testNoDuplicate = [
    { keys: ["a", "b"] as const, value: "first" },
    { keys: ["c", "d"] as const, value: "second" } // Different keys - should be fine
] as const

export type VerificationStep3 = {
    duplicate1: typeof testDuplicate1
    duplicate2: typeof testDuplicate2
    noDuplicate: typeof testNoDuplicate
}
