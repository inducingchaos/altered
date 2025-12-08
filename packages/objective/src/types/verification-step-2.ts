/**
 * VERIFICATION STEP 2: Key Type Preservation
 *
 * Purpose: Verify that ConfigValue preserves the exact tuple type of keys,
 * not just string[].
 *
 * What to check:
 * - Hover over TestConfigValue1Keys - should be ["a", "b"], NOT string[]
 * - Hover over TestConfigValue2Keys - should be ["x", "y", "z"], NOT string[]
 * - The keys should maintain their literal types
 */

import type { ConfigValue } from "../core/types"

// Test 1: ConfigValue with ["a", "b"] keys
type TestConfigValue1 = ConfigValue<["a", "b"], string>
type TestConfigValue1Keys = TestConfigValue1["keys"]
// Expected: ["a", "b"] (readonly tuple)
// NOT: string[] or readonly string[]

// Test 2: ConfigValue with ["x", "y", "z"] keys
type TestConfigValue2 = ConfigValue<["x", "y", "z"], number>
type TestConfigValue2Keys = TestConfigValue2["keys"]
// Expected: ["x", "y", "z"] (readonly tuple)

// Test 3: ConfigValue with single key
type TestConfigValue3 = ConfigValue<["single"], boolean>
type TestConfigValue3Keys = TestConfigValue3["keys"]
// Expected: ["single"] (readonly tuple)

export type VerificationStep2 = {
    test1: TestConfigValue1Keys
    test2: TestConfigValue2Keys
    test3: TestConfigValue3Keys
}
