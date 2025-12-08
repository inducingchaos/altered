# @altered/objective

Flat, index-based config system with order-independent accessors and type-safe duplicate detection.

## Features

- **Order-Independent Accessors**: Access config values with keys in any order
- **Type-Safe Keys**: Keys are inferred as literal tuples, not `string[]`
- **Duplicate Detection**: Type-level detection of duplicate key sets (even in different orders)
- **Environment Scoping**: Server/client code-splitting with type safety
- **Zod Validation**: Optional Zod schemas for runtime validation

## Usage

### Basic Example

```typescript
import { createConfig } from "@altered/objective"
import { z } from "zod"

const { get } = createConfig([
    {
        keys: ["auth", "secret"] as const, // Use 'as const' to preserve literal types
        environment: "server",
        validator: z.string().min(1),
        value: process.env.AUTH_SECRET
    },
    {
        keys: ["features", "enabled"] as const,
        validator: z.boolean(),
        value: true
    }
] as const) // Also use 'as const' on the array

// Access in any order
const secret = get("auth", "secret")
const secret2 = get("secret", "auth") // Same result!

const enabled = get("features", "enabled")
```

### Important: Use `as const`

**Critical**: You must use `as const` on:

1. Each `keys` array: `keys: ["a", "b"] as const`
2. The entire config array: `createConfig([...] as const)`

This preserves literal tuple types instead of inferring `string[]`, which enables:

- Proper type inference for the `get` function
- Duplicate detection at the type level
- Order-independent matching

### Environment Scoping

```typescript
const { get } = createConfig([
    {
        keys: ["server", "only"] as const,
        environment: "server", // Server-only
        value: process.env.SECRET
    },
    {
        keys: ["client", "only"] as const,
        environment: "client", // Client-only
        value: "client-value"
    },
    {
        keys: ["both", "accessible"] as const,
        // No environment = both server and client
        value: "shared-value"
    }
] as const)
```

### Duplicate Detection

The type system will error if you define duplicate key sets (even in different orders):

```typescript
// ❌ This will cause a type error
const { get } = createConfig([
    { keys: ["a", "b"] as const, value: "first" },
    { keys: ["b", "a"] as const, value: "second" } // Error: duplicate keys
] as const)

// ✅ This is fine
const { get } = createConfig([
    { keys: ["a", "b"] as const, value: "first" },
    { keys: ["c", "d"] as const, value: "second" } // Different keys
] as const)
```

## Type System

See [TYPE_SYSTEM.md](./TYPE_SYSTEM.md) for detailed documentation on the type system architecture and verification steps.

## API

### `createConfig<TDefinition>(definition: TDefinition)`

Creates a config instance from a definition array.

**Parameters:**

- `definition`: Array of config value objects (use `as const`)

**Returns:**

- `{ get, definition }`: Object with `get` function and original definition

### `get<TKeys>(...keys: TKeys)`

Retrieves a config value by keys (order-independent).

**Parameters:**

- `...keys`: Variadic string keys in any order

**Returns:**

- The config value (type inferred from validator or value)

## Verification

See the verification files in `src/types/verification-step-*.ts` to test each component of the type system.
