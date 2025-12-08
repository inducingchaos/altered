/**
 * VERIFICATION STEP 1: SameElements Type
 *
 * Purpose: Verify that SameElements correctly identifies when two tuples
 * contain the same elements regardless of order.
 *
 * What to check:
 * - Hover over each Test type to see if it resolves to the expected value
 * - Test1 should be `true` (same elements, different order)
 * - Test2 should be `false` (different elements)
 * - Test3 should be `false` (different elements)
 * - Test4 should be `true` (same elements, different order)
 */

import type { SameElements } from "./permutations"

// Test 1: ["a", "b"] vs ["b", "a"] - should be true
type Test1 = SameElements<["a", "b"], ["b", "a"]>
// Expected: true

// Test 2: ["a", "b"] vs ["a", "b", "c"] - should be false (different lengths)
type Test2 = SameElements<["a", "b"], ["a", "b", "c"]>
// Expected: false

// Test 3: ["a"] vs ["b"] - should be false (different elements)
type Test3 = SameElements<["a"], ["b"]>
// Expected: false

// Test 4: ["a", "b", "c"] vs ["c", "a", "b"] - should be true
type Test4 = SameElements<["a", "b", "c"], ["c", "a", "b"]>
// Expected: true

// Test 5: ["a", "a"] vs ["a"] - should be false (duplicates in first)
type Test5 = SameElements<["a", "a"], ["a"]>
// Expected: false (different lengths)

// Test 6: ["a", "b"] vs ["a", "b"] - should be true (same order)
type Test6 = SameElements<["a", "b"], ["a", "b"]>
// Expected: true

export type VerificationStep1 = {
    test1: Test1
    test2: Test2
    test3: Test3
    test4: Test4
    test5: Test5
    test6: Test6
}
