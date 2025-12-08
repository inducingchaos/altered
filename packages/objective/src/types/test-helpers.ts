/**
 * Test helpers for verifying type system behavior
 * These are not exported - used for type-level testing only
 */

import type { SameElements } from "./permutations"
import type { ConfigValue } from "../core/types"

// Test SameElements
type TestSameElements1 = SameElements<["a", "b"], ["b", "a"]> // Should be true
type TestSameElements2 = SameElements<["a", "b"], ["a", "b", "c"]> // Should be false
type TestSameElements3 = SameElements<["a"], ["b"]> // Should be false
type TestSameElements4 = SameElements<["a", "b", "c"], ["c", "a", "b"]> // Should be true

// Test ConfigValue key preservation
type TestConfigValue1 = ConfigValue<["a", "b"], string>
type TestConfigValue1Keys = TestConfigValue1["keys"] // Should be ["a", "b"], not string[]

// Test duplicate detection would go here once implemented

