# Refactor oRPC API to Monorepo Packages

## Overview

Extract the oRPC API implementation into packages following the monorepo architecture with hyphenated package names: `@altered/data-shapes` (public, schemas), `@altered/harness` (public, Router type), `@altered-internal/data-store` (internal, db), `@altered-internal/data-access` (internal, access functions), and `@altered-internal/harness` (internal, server implementation).

## Package Structure

### 1. Create `packages/public/data-shapes` (@altered/data-shapes)

- **Purpose**: Public schemas, validators, and shared types (custom, generalized types)
- **Files to copy**:
    - `apps/web/src/server/data/store/tables/thoughts.ts` → `packages/public/data-shapes/src/thoughts.ts`
    - Extract `thoughtSchema`, `creatableThoughtSchema`, `Thought`, `CreatableThought` types
- **Dependencies**: `arktype`
- **Exports**: Schema definitions for use across packages
- **Note**: This is a public package, so it should not depend on internal packages. Only custom types, not derivatives of external packages.

### 2. Create `packages/public/harness` (@altered/harness)

- **Purpose**: Public API client package, exports Router type and contracts
- **Files to copy**:
    - `apps/web/src/server/api/contract/factory.ts` → `packages/public/harness/src/contract/factory.ts`
    - `apps/web/src/server/api/contract/index.ts` → `packages/public/harness/src/contract/index.ts`
    - `apps/web/src/server/api/contract/thoughts.ts` → `packages/public/harness/src/contract/thoughts.ts`
    - `apps/web/src/server/api/contract/experimental.ts` → `packages/public/harness/src/contract/experimental.ts`
- **Dependencies**:
    - `workspace:orpc` versions of `@orpc/contract`, `@orpc/server` (types only)
    - `@altered/data-shapes` (for schemas)
    - `arktype`
- **Exports**:
    - `Router` type (re-exported from internal/harness)
    - Contract types
    - Client utilities

### 3. Create `packages/internal/data-store` (@altered-internal/data-store)

- **Purpose**: Internal database store (drizzle tables, relations, db instance)
- **Files to copy**:
    - `apps/web/src/server/data/store/tables/auth.ts` → `packages/internal/data-store/src/tables/auth.ts`
    - `apps/web/src/server/data/store/tables/thoughts.ts` → `packages/internal/data-store/src/tables/thoughts.ts`
    - `apps/web/src/server/data/store/tables/index.ts` → `packages/internal/data-store/src/tables/index.ts`
    - `apps/web/src/server/data/store/relations/index.ts` → `packages/internal/data-store/src/relations/index.ts`
    - `apps/web/src/server/data/store/index.ts` → `packages/internal/data-store/src/index.ts` (db instance - but needs config, so may stay in web app)
- **Dependencies**:
    - `drizzle-orm`
    - `@altered/data-shapes` (for schema types)
    - `postgres` (or connection library)
- **Exports**: Tables, relations, Database type
- **Note**: The actual `db` instance creation may need to stay in the web app since it requires config. Export the type and table/relation definitions.

### 4. Create `packages/internal/data-access` (@altered-internal/data-access)

- **Purpose**: Internal data access layer (domain access functions)
- **Files to copy**:
    - `apps/web/src/server/data/access/thoughts.ts` → `packages/internal/data-access/src/thoughts.ts`
    - `apps/web/src/server/data/access/index.ts` → `packages/internal/data-access/src/index.ts`
- **Dependencies**:
    - `@altered-internal/data-store` (for Database type)
    - `@altered-internal/harness` (for context types)
    - `@orpc/client` (for ORPCError)
- **Exports**: Access functions

### 5. Create `packages/internal/harness` (@altered-internal/harness)

- **Purpose**: Internal API server implementation
- **Files to copy**:
    - `apps/web/src/server/api/factory.ts` → `packages/internal/harness/src/factory.ts`
    - `apps/web/src/server/api/context.ts` → `packages/internal/harness/src/context.ts`
    - `apps/web/src/server/api/middleware/index.ts` → `packages/internal/harness/src/middleware/index.ts`
    - `apps/web/src/server/api/router/factory.ts` → `packages/internal/harness/src/router/factory.ts`
    - `apps/web/src/server/api/router/thoughts.ts` → `packages/internal/harness/src/router/thoughts.ts`
    - `apps/web/src/server/api/router/experimental.ts` → `packages/internal/harness/src/router/experimental.ts`
    - `apps/web/src/server/api/router/index.ts` → `packages/internal/harness/src/router/index.ts` (actual router implementation)
- **Dependencies**:
    - `workspace:orpc` versions of all @orpc packages
    - `@altered/data-shapes` (for schemas)
    - `@altered/harness` (for contracts)
    - Auth types (import from web app's auth package or create auth package if needed)
- **Exports**:
    - Router implementation
    - Router type (exported to @altered/harness)
    - Factory, context, middleware exports

## Implementation Steps

### Phase 1: Create Package Structure

1. Create `packages/public/data-shapes/package.json` with name `@altered/data-shapes`
2. Create `packages/public/harness/package.json` with name `@altered/harness`
3. Create `packages/internal/data-store/package.json` with name `@altered-internal/data-store` (private: true)
4. Create `packages/internal/data-access/package.json` with name `@altered-internal/data-access` (private: true)
5. Create `packages/internal/harness/package.json` with name `@altered-internal/harness` (private: true)
6. Add `tsconfig.json` files for each package
7. Update `pnpm-workspace.yaml` to include `packages/public/*` and `packages/internal/*`

### Phase 2: Copy Files (using `cp`)

1. Copy schema files to `@altered/data-shapes`
2. Copy contract files to `@altered/harness`
3. Copy table/relation files to `@altered-internal/data-store`
4. Copy access function files to `@altered-internal/data-access`
5. Copy factory, context, middleware, router files to `@altered-internal/harness`
6. Preserve all comments and formatting

### Phase 3: Update Imports in Packages

1. Update `@altered/data-shapes` exports
2. Update `@altered/harness` imports:
    - Change schema imports to `@altered/data-shapes`
    - Update internal package imports to use relative paths
3. Update `@altered-internal/data-store` imports:
    - Change schema imports to `@altered/data-shapes`
    - Update internal imports
4. Update `@altered-internal/data-access` imports:
    - Change context imports to `@altered-internal/harness`
    - Change store imports to `@altered-internal/data-store`
5. Update `@altered-internal/harness` imports:
    - Change schema imports to `@altered/data-shapes`
    - Change contract imports to `@altered/harness`
    - Update auth/db imports to accept from apps (via parameters or dependency injection)
    - Keep context.ts in this package (it's API-specific)

### Phase 4: Export Router Type

1. In `@altered-internal/harness/src/router/index.ts`, export the router and Router type
2. In `@altered/harness/src/index.ts`, re-export the Router type from `@altered-internal/harness` using type-only import
3. Ensure type-only imports are used where appropriate

### Phase 5: Update Web App

1. Update `apps/web/src/server/data/store/index.ts` to import tables/relations from `@altered-internal/data-store` (db instance creation stays here with config)
2. Update `apps/web/src/server/data/access/thoughts.ts` to import from `@altered-internal/data-access` or keep local if it needs web-specific context
3. Update `apps/web/src/server/api/router/thoughts.ts` to import from packages
4. Update `apps/web/src/server/api/middleware/index.ts` to import from packages (auth/db passed as parameters)
5. Update `apps/web/src/lib/infra/rpc/client.ts` to import `Router` from `@altered/harness`
6. Update `apps/web/src/lib/infra/rpc/client.server.ts` to import `Router` from `@altered/harness`
7. Update `apps/web/src/app/(routes)/rpc/[[...rest]]/route.ts` to import `router` from `@altered-internal/harness`
8. Update `apps/web/src/app/(routes)/api/[[...rest]]/route.ts` to import `router` from `@altered-internal/harness`
9. Remove oRPC dependencies from `apps/web/package.json` (keep only runtime deps if any)

### Phase 6: Update Launcher App

1. Update `apps/launcher/src/lib/auth/api/client.ts` to import `Router` type from `@altered/harness`
2. Complete the client implementation using the Router type

### Phase 7: Dependency Management

1. Add dependencies to `@altered/data-shapes/package.json`: `arktype`
2. Add dependencies to `@altered/harness/package.json`:
    - `workspace:orpc` catalog refs for `@orpc/contract`, `@orpc/server` (types)
    - `@altered/data-shapes`
    - `arktype`
3. Add dependencies to `@altered-internal/data-store/package.json`:
    - `drizzle-orm`
    - `@altered/data-shapes`
    - `postgres` (or connection library)
4. Add dependencies to `@altered-internal/data-access/package.json`:
    - `@altered-internal/data-store`
    - `@altered-internal/harness`
    - `@orpc/client` (for ORPCError)
5. Add dependencies to `@altered-internal/harness/package.json`:
    - `workspace:orpc` catalog refs for all @orpc packages
    - `@altered/data-shapes`
    - `@altered/harness`
6. Add `@altered/harness` as dependency of `apps/web` and `apps/launcher`
7. Add `@altered-internal/harness` as dependency of `apps/web` only
8. Add `@altered-internal/data-store` as dependency of `apps/web` (if db instance creation stays there)
9. Remove unused oRPC deps from `apps/web/package.json`

### Phase 8: Type Checking

1. Run `pnpm typecheck` in `@altered/data-shapes`
2. Run `pnpm typecheck` in `@altered/harness`
3. Run `pnpm typecheck` in `@altered-internal/data-store`
4. Run `pnpm typecheck` in `@altered-internal/data-access`
5. Run `pnpm typecheck` in `@altered-internal/harness`
6. Run `pnpm typecheck` in `apps/web`
7. Run `pnpm typecheck` in `apps/launcher`

## Key Considerations

- **Public vs Internal**: Public packages (`@altered/*`) can be published, internal (`@altered-internal/*`) cannot
- **Dependency Rules**: Public packages cannot depend on internal. Internal can depend on public.
- **Package Naming**: Use hyphenated names: `data-shapes`, `data-store`, `data-access` (not nested `data/shapes`)
- **Router Type Export**: The Router type must be accessible from `@altered/harness` (public) but the implementation lives in `@altered-internal/harness`. Use type-only re-exports.
- **Middleware**: Middleware in `@altered-internal/harness` will need to accept `auth` and `db` instances as parameters since they can't be instantiated in the package
- **Context Types**: Context types in `@altered-internal/harness` will reference types from `@altered/data-shapes` and auth types (which stay in web app's auth package for now)
- **AuthContext**: Stays in the web app's auth package (not moved to shapes, as it's a derivative of Better Auth)
- **DB Instance**: The actual `db` instance creation may need to stay in the web app since it requires config. The package exports types and table definitions.
- **Access Functions**: May stay in web app if they need web-specific context, or move to `@altered-internal/data-access` if they can be generalized

## Files to Modify

### New Files (packages)

- `packages/public/data-shapes/package.json`
- `packages/public/data-shapes/tsconfig.json`
- `packages/public/data-shapes/src/index.ts`
- `packages/public/data-shapes/src/thoughts.ts`
- `packages/public/harness/package.json`
- `packages/public/harness/tsconfig.json`
- `packages/public/harness/src/index.ts` (exports Router type)
- `packages/public/harness/src/contract/*` (all contract files)
- `packages/internal/data-store/package.json` (private: true)
- `packages/internal/data-store/tsconfig.json`
- `packages/internal/data-store/src/index.ts`
- `packages/internal/data-store/src/tables/*` (all table files)
- `packages/internal/data-store/src/relations/index.ts`
- `packages/internal/data-access/package.json` (private: true)
- `packages/internal/data-access/tsconfig.json`
- `packages/internal/data-access/src/index.ts`
- `packages/internal/data-access/src/thoughts.ts`
- `packages/internal/harness/package.json` (private: true)
- `packages/internal/harness/tsconfig.json`
- `packages/internal/harness/src/index.ts`
- All copied API files in internal/harness

### Modified Files

- `pnpm-workspace.yaml`
- `apps/web/package.json`
- `apps/web/src/lib/infra/rpc/client.ts`
- `apps/web/src/lib/infra/rpc/client.server.ts`
- `apps/web/src/app/(routes)/rpc/[[...rest]]/route.ts`
- `apps/web/src/app/(routes)/api/[[...rest]]/route.ts`
- `apps/web/src/server/data/store/index.ts` (imports from packages)
- `apps/web/src/server/data/access/thoughts.ts` (may import from packages or stay local)
- `apps/web/src/server/api/router/thoughts.ts` (imports)
- `apps/web/src/server/api/middleware/index.ts` (imports)
- `apps/web/src/server/api/context.ts` (moved to internal/harness)
- `apps/launcher/package.json`
- `apps/launcher/src/lib/auth/api/client.ts`
