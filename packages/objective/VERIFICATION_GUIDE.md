# Type System Verification Guide

This guide walks through verifying each component of the type system.

## Current Status

✅ **Duplicate Detection**: Working - causes type errors when duplicate keys are detected
⚠️ **Key Type Inference**: Requires `as const` on keys arrays to preserve literal types
✅ **SameElements**: Implemented and should work correctly
✅ **Environment Scoping**: Implemented

## Verification Steps

### Step 1: Verify `SameElements` Type

**File**: `src/types/verification-step-1.ts`

**What to check**:

1. Open the file in your IDE
2. Hover over each test type (`Test1`, `Test2`, etc.)
3. Verify they resolve to the expected values:
    - `Test1` should be `true` (same elements, different order)
    - `Test2` should be `false` (different lengths)
    - `Test3` should be `false` (different elements)
    - `Test4` should be `true` (same elements, different order)
    - `Test5` should be `false` (different lengths due to duplicates)
    - `Test6` should be `true` (same order)

**If it doesn't work**: The `SameElements` type in `src/types/permutations.ts` needs to be fixed.

---

### Step 2: Verify Key Type Preservation

**File**: `src/types/verification-step-2.ts`

**What to check**:

1. Open the file in your IDE
2. Hover over `TestConfigValue1Keys`, `TestConfigValue2Keys`, `TestConfigValue3Keys`
3. Verify they show as literal tuples:
    - `TestConfigValue1Keys` should be `["a", "b"]` (NOT `string[]` or `readonly string[]`)
    - `TestConfigValue2Keys` should be `["x", "y", "z"]`
    - `TestConfigValue3Keys` should be `["single"]`

**If it doesn't work**: The `ConfigValue` type in `src/core/types.ts` is working correctly, but you need to use `as const` when creating config values.

---

### Step 3: Verify Duplicate Detection

**File**: `src/types/verification-step-3.ts`

**What to check**:

1. Open the file in your IDE
2. Look for type errors on `testDuplicate1` and `testDuplicate2`
3. `testNoDuplicate` should NOT have errors

**Current Status**: ✅ Working - the typecheck should show errors for duplicates.

**If it doesn't work**: The `DetectDuplicates` type in `src/types/accessor.ts` or its usage in `createConfig` needs to be fixed.

---

### Step 4: Verify `createConfig` Type Inference

**File**: `src/types/verification-step-4.ts`

**What to check**:

1. Open the file in your IDE
2. Hover over `test1.definition[0].keys` - should be `["test", "key"]`, NOT `string[]`
3. `test2` should show a type error (duplicate keys)
4. Hover over `result` in `test3` - should be `boolean`, NOT `unknown`

**Current Status**:

- ✅ Duplicate detection works (test2 errors)
- ⚠️ Key inference requires `as const` on keys arrays
- ⚠️ Value type inference may need work

**If it doesn't work**:

- For key inference: You must use `as const` on each keys array
- For value inference: The `GetValueReturn` type in `src/core/get-value.ts` may need adjustment

---

## How to Fix Key Type Inference

The issue is that TypeScript infers `["a", "b"]` as `string[]` by default. To preserve literal types, you must use `as const`:

```typescript
// ❌ Wrong - keys will be inferred as string[]
const { get } = createConfig([
    {
        keys: ["a", "b"], // Type: string[]
        value: "test"
    }
])

// ✅ Correct - keys will be inferred as ["a", "b"]
const { get } = createConfig([
    {
        keys: ["a", "b"] as const, // Type: ["a", "b"]
        value: "test"
    }
] as const) // Also use as const on the array
```

## Next Steps

1. **Verify Step 1**: Check if `SameElements` works correctly
2. **Verify Step 2**: Confirm that `ConfigValue` preserves types (when using `as const`)
3. **Verify Step 3**: Confirm duplicate detection works (should already be working)
4. **Verify Step 4**: Test full `createConfig` inference

Once you've verified each step, we can:

- Fix any issues found
- Improve type inference to require less `as const` usage
- Add better error messages
