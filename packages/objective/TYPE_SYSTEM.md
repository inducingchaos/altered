# Type System Architecture

This document describes the type system strategy for `@altered/objective`, which enables order-independent accessor matching and type-safe config definitions.

## Goals

1. **Order-Independent Accessors**: Keys can be passed in any order and still match
2. **Type-Safe Keys**: Keys should be inferred as string literal tuples, not `string[]`
3. **Duplicate Detection**: Type-level detection of duplicate key sets (even in different orders)
4. **Type-Safe Value Retrieval**: The `get` function should return the correct type based on the keys

## Type System Components

### 1. Core Types (`src/core/types.ts`)

**Purpose**: Define the structure of config values and extract value types.

**Key Types**:

- `ConfigValue<TKeys, TValue, TValidator>`: A single config value definition
- `ConfigValueType<T>`: Extracts the inferred type from a config value (uses validator if present)
- `ConfigDefinition`: Array of config values

**What to verify**:

- `ConfigValue` should preserve the exact tuple type of `TKeys`
- `ConfigValueType` should correctly extract types from Zod validators

### 2. Permutation Matching (`src/types/permutations.ts`)

**Purpose**: Check if two tuples contain the same elements regardless of order.

**Key Types**:

- `TupleToUnion<T>`: Converts a tuple to a union of its elements
- `SameElements<T1, T2>`: Checks if two tuples have the same elements (order-independent)

**Strategy**:

- Compare element unions (not permutations - too expensive)
- Also check length to ensure exact match
- Example: `["a", "b"]` and `["b", "a"]` should match

**What to verify**:

- `SameElements<["a", "b"], ["b", "a"]>` should be `true`
- `SameElements<["a", "b"], ["a", "b", "c"]>` should be `false`
- `SameElements<["a"], ["b"]>` should be `false`

### 3. Duplicate Detection (`src/types/accessor.ts`)

**Purpose**: Detect duplicate key sets in a config definition at the type level.

**Key Types**:

- `DetectDuplicates<T, Index>`: Recursively checks for duplicates
- `CheckAgainstRest<T, Index, CheckIndex>`: Compares one element against the rest

**Strategy**:

- Iterate through each config value
- Compare against all subsequent values using `SameElements`
- Return `true` if any duplicates found, `false` otherwise

**What to verify**:

- Should error if two config values have the same keys (even in different orders)
- Should not error if keys are different

### 4. Config Factory (`src/core/create-config.ts`)

**Purpose**: Create a type-safe config instance with proper type inference.

**Key Function**:

- `createConfig<TDefinition>(definition: TDefinition)`: Factory function

**Type Inference Strategy**:

- Use `as const` assertion on the definition array to preserve literal types
- Constrain `TDefinition` to ensure proper inference
- Use conditional type to detect duplicates and error if found

**What to verify**:

- Keys should be inferred as `readonly ["a", "b"]` not `readonly string[]`
- Duplicate keys should cause a type error
- Return type should preserve all key/value relationships

### 5. Value Retrieval (`src/core/get-value.ts`)

**Purpose**: Type-safe value retrieval with order-independent matching.

**Key Types**:

- `FindMatchingValue<TConfig, TKeys>`: Finds a config value matching the search keys
- `GetValueReturn<TConfig, TKeys>`: Returns the type of the matching value

**Strategy**:

- Iterate through config values
- Use `SameElements` to find a match (order-independent)
- Return the value type of the matching config

**What to verify**:

- `get("a", "b")` should match a config with keys `["b", "a"]`
- Return type should be correctly inferred
- Non-existent keys should return `never`

## Type Flow

1. **Definition**: User provides config array with `as const`
2. **Inference**: TypeScript infers literal tuple types for keys
3. **Validation**: `createConfig` checks for duplicates at type level
4. **Storage**: Config values stored with preserved types
5. **Retrieval**: `get` function matches keys using `SameElements` and returns correct type

## Testing Strategy

For each component, create test cases that verify:

1. Type inference works correctly
2. Type errors occur when expected
3. Order independence works
4. Duplicate detection works

## Implementation Order

1. Fix `ConfigValue` to preserve tuple types
2. Verify `SameElements` works correctly
3. Implement duplicate detection
4. Fix `createConfig` to use `as const` and detect duplicates
5. Fix `get` function type inference
