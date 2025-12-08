# Create @altered/objective Package

## Overview

Build a new config system package that replaces nested objects with flat, order-independent accessor-based configuration. The system will use TypeScript permutation types for true order-independence, Zod for validation, and code-splitting for server/client boundaries.

## Implementation Plan

### 1. Package Structure Setup

Create the package in `/packages/objective/` with:

- `package.json` with `@altered/objective` name and workspace dependencies
- `tsconfig.json` for TypeScript configuration
- Basic directory structure: `src/` with core modules

### 2. Core Type System

Build TypeScript utilities for order-independent accessors:

- **Permutation Types**: Generate all possible orderings of string literal tuples
- **Accessor Normalization**: Type-level utilities to detect equivalent accessors regardless of order
- **Duplicate Detection**: Type system to prevent duplicate accessors (even in different orders)

Key files:

- `src/types/accessor.ts` - Core accessor type utilities
- `src/types/permutations.ts` - Permutation generation types
- `src/types/config.ts` - Config definition types

### 3. Config Definition System

Create `createConfig` function that:

- Accepts array of config value objects (no arbitrary property names needed)
- Each config value has: `keys` (array), optional `environment` ("server" | "client"), optional `validator` (Zod schema), and `value`
- Infers types for all accessors and their permutations
- Detects duplicates at type level
- Returns object with `get` function for value access

Key files:

- `src/core/create-config.ts` - Main config factory
- `src/core/types.ts` - Config value definition types

### 4. Validation Integration

Integrate Zod schemas:

- Each config value can have an optional Zod schema
- Validation happens at config creation time
- Type inference from Zod schemas

### 5. Environment Scoping

Implement server/client code-splitting:

- Config values can specify `environment: "server" | "client"` (undefined = both)
- Server-only values are excluded from client bundles using Next.js conventions
- Type system prevents accessing server values in client contexts

Key files:

- `src/core/environment.ts` - Environment scoping utilities
- `src/core/client.ts` - Client-safe config accessor

### 6. Config Value Access

Create `get` function exported from `createConfig`:

- Accepts variadic string accessors in any order
- Returns typed value
- Works in both server and client contexts
- Type-safe lookup with autocomplete

Key files:

- `src/core/accessor.ts` - Accessor resolution logic
- `src/core/get-value.ts` - Value retrieval function

### 7. Full Migration Examples

Migrate three config sections in web app:

- **env config**: Server-only (all values have `environment: "server"`)
- **features config**: Both (no `environment` property)
- **localization config**: Client-only (all values have `environment: "client"`)

Key files:

- `apps/web/src/config/objective/env.ts` - Server-only env config
- `apps/web/src/config/objective/features.ts` - Both features config
- `apps/web/src/config/objective/localization.ts` - Client-only localization config

### 8. Package Integration

- Add `@altered/objective` to web app dependencies using `workspace:*`
- Export public API from package `index.ts`
- Ensure proper TypeScript path resolution

## Technical Considerations

- **Permutation Types**: Use recursive conditional types to generate all possible orderings
- **Code Splitting**: Use Next.js `"use server"` directives and conditional exports
- **Type Performance**: Permutation types can be expensive - may need to limit to reasonable key counts (e.g., max 4-5 keys per accessor)
- **Validation**: Run Zod validation at config creation, not access time
- **Duplicate Detection**: Use mapped types to check for duplicate accessor sets
- **Array Definition Pattern**: Use variadic tuple types or array-of-objects pattern to avoid arbitrary property names
- **Future Optimization**: Consider type generation/compilation for better editor performance (see notes below)

## Future Optimizations (Not in Scope)

- **Object Access Notation**: Support `config.auth.internal.env.secret` syntax using string-to-object-path type tricks
- **Type Generation**: Compile types on save for better editor performance, especially as config grows large. Consider generating type definitions separately and importing them to reduce TypeScript compilation overhead.

## Files to Create

```
packages/objective/
  package.json
  tsconfig.json
  src/
    index.ts (public API)
    core/
      create-config.ts
      accessor.ts
      get-value.ts
      environment.ts
      types.ts
    types/
      accessor.ts
      permutations.ts
      config.ts
    utils/
      normalize.ts
```

## Example Usage

```typescript
const { get } = createConfig([
    {
        keys: ["auth", "env", "secret", "internal"],
        environment: "server",
        validator: z.string().min(1),
        value: process.env.AUTH_SECRET
    },
    {
        keys: ["features", "test"],
        // No environment = both server and client
        validator: z.boolean(),
        value: false
    }
])

// Access in any order
const secret = get("auth", "env", "secret", "internal")
const feature = get("test", "features") // Same as above, different order
```
