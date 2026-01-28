---
name: View Thoughts Memoization Audit
overview: Systematically eliminate all unstable references, unnecessary re-computations, and memory-intensive patterns in the view-thoughts command to stabilize memory usage at 990+ thoughts.
todos:
  - id: fix-query-options-memo
    content: Add useMemo to useThoughtsQueryOptions return value
    status: pending
  - id: create-format-date-helper
    content: Create features/shared/utils/format-date.ts with preset-based formatters
    status: pending
  - id: fix-thoughts-memo
    content: Add useMemo to thoughts array flatMap in useThoughts
    status: pending
  - id: fix-handler-callbacks
    content: Wrap handleCreate/Update/Delete in useCallback
    status: pending
  - id: fix-action-props-memo
    content: Wrap actionProps object in useMemo
    status: pending
  - id: fix-accessories-cache
    content: Cache accessories array per thought with Map + useRef
    status: pending
  - id: fix-mutation-options
    content: Memoize mutation options and extract callbacks
    status: pending
  - id: fix-action-palette-context
    content: Memoize ActionPaletteProvider context value
    status: pending
  - id: fix-systems-filter-memo
    content: Memoize systems and filteredSystems arrays
    status: pending
  - id: fix-find-action-callback
    content: Wrap findAction in useCallback
    status: pending
  - id: document-mutation-queue
    content: Add JSDoc to MutationQueueProvider clarifying placeholder status
    status: pending
  - id: remove-zod-config
    content: Remove Zod from config schema, create transform helper
    status: pending
  - id: remove-zod-logger
    content: Remove Zod from logger constants, use plain TS types
    status: pending
isProject: false
---

# View Thoughts Memoization Audit

Complete deep-dive analysis of `view-thoughts.tsx` and all dependencies, identifying every optimization opportunity.

---

## Critical Issues (Fix First)

### 1. `useThoughtsQueryOptions` - Missing `useMemo`

**File:** [`apps/launcher/src/app/commands/view-thoughts/use-thoughts-query-options.tsx`](apps/launcher/src/app/commands/view-thoughts/use-thoughts-query-options.tsx)

**Problem:** The entire query options object is recreated on every render.

```typescript
// Current (line 9-42)
export function useThoughtsQueryOptions(props?: { authToken: string | null }) {
    return router.thoughts.get.infiniteOptions({ ... })  // New object every render
}
```

**Fix:** Wrap return in `useMemo`:

```typescript
import { useMemo } from "react"

export function useThoughtsQueryOptions(props?: { authToken: string | null }) {
    const { authToken = null } = props ?? {}
    
    return useMemo(() => router.thoughts.get.infiniteOptions({
        input: (pageParam: CursorDefinition | null) => ({
            pagination: { ... }
        }),
        context: { authToken },
        initialPageParam: null,
        getNextPageParam: lastPage => { ... }
    }), [authToken])
}
```

**Impact:** Prevents query re-initialization on every render. Massive reduction in garbage collection.

---

### 2. New `Intl.DateTimeFormat` Instance Per List Item

**File:** [`apps/launcher/src/app/commands/view-thoughts/index.tsx`](apps/launcher/src/app/commands/view-thoughts/index.tsx) (lines 543-550)

**Problem:** A new `Intl.DateTimeFormat` is created for every thought in the list (900x).

```tsx
text={{
    value: new Intl.DateTimeFormat(  // New instance per item!
        undefined,
        { dateStyle: "short", timeStyle: "short", hour12: false }
    ).format(thought.createdAt),
    color: Color.SecondaryText
}}
```

**Fix:** Create shared `formatDate` utility with preset-based formatters:

**New file:** `apps/launcher/src/features/shared/utils/format-date.ts`

```typescript
/**
 * Preset date formatters with module-level Intl.DateTimeFormat instances.
 */

type DateFormatPreset = "compact"

const formatters: Record<DateFormatPreset, Intl.DateTimeFormat> = {
    compact: new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "short",
        hour12: false
    })
}

export function formatDate(
    date: Date,
    options: { preset: DateFormatPreset }
): string {
    return formatters[options.preset].format(date)
}
```

**Usage in view-thoughts:**

```tsx
import { formatDate } from "~/shared/utils/format-date"

// Then in render:
text={{
    value: formatDate(thought.createdAt, { preset: "compact" }),
    color: Color.SecondaryText
}}
```

**Note on `{value, color}` object:** Creating this simple 2-property object per-item is acceptable overhead since:

- Raycast virtualizes the list (~10-20 visible items, not 900)
- The date value must be computed per-item anyway
- Object creation is cheap in modern JS
- The real win is eliminating formatter instantiation (900x → 1x)

**Impact:** Eliminates 900x `Intl.DateTimeFormat` instantiation overhead per render.

---

### 3. Unstable `thoughts` Array in `useThoughts`

**File:** [`apps/launcher/src/app/commands/view-thoughts/use-thoughts.tsx`](apps/launcher/src/app/commands/view-thoughts/use-thoughts.tsx) (line 65)

**Problem:** `flatMap` creates a new array on every render.

```typescript
const thoughts = data?.pages.flatMap(page => page.thoughts ?? []) ?? null
```

**Fix:** Wrap in `useMemo`:

```typescript
const thoughts = useMemo(
    () => data?.pages.flatMap(page => page.thoughts ?? []) ?? null,
    [data?.pages]
)
```

**Impact:** Prevents array recreation unless data actually changes.

---

## High Priority Issues

### 4. Unstable `actionProps` Object

**File:** [`apps/launcher/src/app/commands/view-thoughts/index.tsx`](apps/launcher/src/app/commands/view-thoughts/index.tsx) (lines 474-482)

**Problem:** New object created every render, passed to every `ThoughtListActions`.

```tsx
const actionProps: ThoughtListActionsProps = {
    isShowingInspector,
    setIsShowingInspector,
    // ... more props
}
```

**Fix:** Wrap in `useMemo`:

```typescript
const actionProps = useMemo<ThoughtListActionsProps>(() => ({
    isShowingInspector,
    setIsShowingInspector,
    setIsCreatingThought,
    setEditingThoughtId,
    handleDeleteThought,
    refreshThoughts: refresh
}), [isShowingInspector, setIsShowingInspector, setIsCreatingThought, setEditingThoughtId, handleDeleteThought, refresh])
```

---

### 5. Handler Functions Not Memoized

**File:** [`apps/launcher/src/app/commands/view-thoughts/index.tsx`](apps/launcher/src/app/commands/view-thoughts/index.tsx) (lines 413-450)

**Problem:** `handleCreateThought`, `handleUpdateThought`, `handleDeleteThought` recreated every render.

**Fix:** Wrap each in `useCallback`:

```typescript
const handleCreateThought = useCallback(
    (thought: CreatableThought) => createMutation.mutate(thought),
    [createMutation.mutate]
)

const handleUpdateThought = useCallback<HandleUpdateThought>(
    props => updateMutation.mutate(props),
    [updateMutation.mutate]
)

const handleDeleteThought = useCallback<HandleDeleteThought>(
    async (thought, props) => {
        // ... existing logic
    },
    [deleteMutation.mutate]
)
```

---

### 6. Inline Accessories Array in List.Item

**File:** [`apps/launcher/src/app/commands/view-thoughts/index.tsx`](apps/launcher/src/app/commands/view-thoughts/index.tsx) (lines 500-509)

**Problem:** New array created for every item on every render.

```tsx
accessories={
    isShowingInspector
        ? null
        : [{
              date: thought.createdAt,
              tooltip: `Created: ${thought.createdAt.toLocaleString()}`
          }]
}
```

**Fix:** Cache accessories array per thought using Map + useRef:

```typescript
// Near top of ThoughtsList component
const accessoriesCache = useRef(new Map<string, List.Item.Accessory[]>())

// Helper to get stable accessory
const getAccessories = useCallback((thought: Thought) => {
    if (isShowingInspector) return null
    
    if (!accessoriesCache.current.has(thought.id)) {
        accessoriesCache.current.set(thought.id, [{
            date: thought.createdAt,
            tooltip: `Created: ${thought.createdAt.toLocaleString()}`
        }])
    }
    return accessoriesCache.current.get(thought.id)!
}, [isShowingInspector])

// In render:
accessories={getAccessories(thought)}
```

**Impact:** Prevents array allocation per-item per-render, reduces GC pressure.

---

### 7. Mutation Options Inline Objects

**File:** [`apps/launcher/src/app/commands/view-thoughts/index.tsx`](apps/launcher/src/app/commands/view-thoughts/index.tsx) (lines 111-385)

**Problem:** Each `useMutation` receives inline objects recreated every render.

**Fix:** Extract mutation options to `useMemo`:

```typescript
const createMutationOptions = useMemo(() => 
    reactApi.thoughts.create.mutationOptions({
        context: { authToken },
        onMutate: async thoughtInput => { /* ... */ },
        onError: (error, _variables, context) => { /* ... */ },
        onSettled: () => { /* ... */ }
    }),
    [authToken, getThoughtsQueryKey, thoughtsQueryKey, queryClient, setPersistentQueryData]
)

const createMutation = useMutation(createMutationOptions)
```

**Note:** The `onMutate`, `onError`, `onSettled` callbacks reference several closures. These need to be wrapped in `useCallback` first, then the mutation options can be memoized.

---

## Medium Priority Issues

### 8. ActionPaletteProvider Context Value Not Memoized

**File:** [`apps/launcher/src/app/commands/action-palette/state.tsx`](apps/launcher/src/app/commands/action-palette/state.tsx) (lines 131-158)

**Problem:** Large context value object recreated every render.

**Fix:** Wrap in `useMemo`:

```typescript
const contextValue = useMemo(() => ({
    isLoading,
    isRenderingAction,
    searchText,
    setSearchText,
    onSearchTextChange,
    selectedItemId,
    setSelectedItemId,
    selectedActionId,
    setSelectedActionId,
    renderedActionId,
    systems,
    filteredSystems,
    selectedAction,
    renderedAction,
    navigationTitle,
    renderAction,
    resetState
}), [
    isLoading, isRenderingAction, searchText, selectedItemId,
    selectedActionId, renderedActionId, systems, filteredSystems,
    selectedAction, renderedAction, navigationTitle, renderAction, resetState
])

return <ActionPaletteContext value={contextValue}>{children}</ActionPaletteContext>
```

---

### 9. `systems` and `filteredSystems` Not Memoized

**File:** [`apps/launcher/src/app/commands/action-palette/state.tsx`](apps/launcher/src/app/commands/action-palette/state.tsx) (lines 55-67)

**Problem:** Computed on every render.

```typescript
const systems = Object.values(staticSystems)  // New array every render
const filteredSystems = filterSystems(systems, { ... })  // Computed every render
```

**Fix:**

```typescript
const systems = useMemo(() => Object.values(staticSystems), [])

const filteredSystems = useMemo(
    () => filterSystems(systems, {
        searchText,
        searchableKeyPaths: [
            "name", "title", "description",
            "actions.name", "actions.title", "actions.description", "actions.trigger"
        ]
    }),
    [systems, searchText]
)
```

---

### 10. `findAction` Function Recreated Per Render

**File:** [`apps/launcher/src/app/commands/action-palette/state.tsx`](apps/launcher/src/app/commands/action-palette/state.tsx) (lines 72-75)

**Fix:** Wrap in `useCallback`:

```typescript
const findAction = useCallback(
    (id: string) =>
        (systems as ALTEREDSystem[])
            .flatMap(system => system.actions)
            .find(action => action.id === id) ?? null,
    [systems]
)
```

---

## Low Priority / Monitoring

### 11. MutationQueueProvider - Document Placeholder Status

**File:** [`apps/launcher/src/app/commands/view-thoughts/mutation-queue-provider.tsx`](apps/launcher/src/app/commands/view-thoughts/mutation-queue-provider.tsx) (lines 35-74)

**Note:** This provider is a placeholder for future mutation queue functionality.

**Fix:** Add JSDoc to clarify:

```typescript
/**
 * Mutation Queue Provider - Placeholder for future implementation.
 * 
 * @remarks This provider is currently incomplete and serves as a placeholder.
 * The baseValue memoization intentionally has empty deps as the queue is not
 * yet reactive. Will be implemented when mutation queueing is needed.
 */
export function MutationQueueProvider({ children }: { children: ReactNode }) {
    // ... existing code
}
```

**Optional:** Add `queue.current` to deps if semantically correct, though it won't trigger updates since refs don't cause re-renders.

---

### 12. Remove All Zod Usage (Bundle Size Optimization)

**Files:**

- [`apps/launcher/src/features/config/schema.ts`](apps/launcher/src/features/config/schema.ts)
- [`apps/launcher/src/features/observability/logger/constants.ts`](apps/launcher/src/features/observability/logger/constants.ts)

**Problem:** Zod adds ~30-50KB per command bundle. Since all config is defined in TypeScript (no runtime parsing of unknown data), we don't need Zod's validation.

**Key requirement:** Recreate `configSchema`'s `.transform()` functionality for deriving config values.

---

#### Part A: Remove Zod from Logger Constants

**File:** `apps/launcher/src/features/observability/logger/constants.ts` (lines 1-52)

**Current:**

```typescript
import { z } from "zod"

export const logPartsConfigSchema = z.object({
    timestamp: z.boolean().optional(),
    level: z.boolean().optional(),
    // ...
})
export type LogPartsConfig = z.infer<typeof logPartsConfigSchema>
```

**Fix:** Replace with plain TypeScript:

```typescript
export type LogPartsConfig = {
    timestamp?: boolean
    level?: boolean
    scope?: boolean
    title?: boolean
    description?: boolean
    data?: boolean
}
```

---

#### Part B: Remove Zod from Config Schema with Chainable Builder

**File:** `apps/launcher/src/features/config/schema.ts`

**Current structure:**

```typescript
import { z } from "zod"

export const configSchema = z.object({ /* ... */ })
    .transform(config => ({ ...config, environment: /* ... */ }))
    .transform(config => ({ ...config, baseUrl: /* ... */ }))
    .transform(config => ({ ...config, rpcEndpoint: /* ... */ }))
```

**New structure:** Chainable builder with layered spreads and type accumulation

```typescript
import { environment } from "@raycast/api"
import type { LogPartsConfig } from "../observability/logger/constants"

/**
 * Base configuration definition (user-provided values).
 */
export type ConfigDefinition = {
    cwd: string
    overrideEnvironment: "development" | "production"
    
    logLevel?: "debug" | "info" | "warn" | "error" | "quiet"
    logSearch?: string
    logParts?: LogPartsConfig
    logToFile?: boolean
    
    appName: string
    appDescription: string
    appIcon: string
    appVersion: string
    
    apiDelay?: number
    themeIcons: boolean
    listPaginationLimit: number
    
    productionBaseUrl: string
    developmentBaseUrl: string
    
    oauthProviderId: string
    oauthProviderDescription: string
    oauthClientId: string
    oauthClientScope: string
}

/**
 * Chainable config builder that accumulates types through transforms.
 * 
 * @remarks Inspired by Zod's .transform() API. Each transform receives
 * the accumulated config type and returns an extension of it.
 */
class ConfigBuilder<T> {
    private transformers: Array<(config: any) => any> = []
    
    /**
     * Add a transformation step that extends the config with new properties.
     * Each transform receives the accumulated config and must return a spread
     * that includes all previous properties plus new ones.
     */
    transform<U>(fn: (config: T) => T & U): ConfigBuilder<T & U> {
        const newBuilder = new ConfigBuilder<T & U>()
        newBuilder.transformers = [...this.transformers, fn]
        return newBuilder
    }
    
    /**
     * Execute all transformations and return the final config.
     * Type parameter T represents the accumulated type from all transforms.
     */
    create<Input extends T>(input: Input): T {
        return this.transformers.reduce(
            (acc, transformer) => transformer(acc),
            input as any
        ) as T
    }
}

/**
 * Initialize a config builder for the given base type.
 * 
 * @example
 * const schema = defineConfig<ConfigDefinition>()
 *     .transform(config => ({ ...config, derived: "value" }))
 *     .transform(config => ({ ...config, moreProps: config.derived }))
 * 
 * const result = schema.create(myConfig)
 */
export function defineConfig<T>(): ConfigBuilder<T> {
    return new ConfigBuilder<T>()
}

/**
 * Helper: Add dark mode modifier to file path.
 */
function addDarkModifierToFilePath(filePath: string): string {
    const modifier = "@dark"
    const possibleExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"]
    
    const extension = possibleExtensions.find(ext => filePath.endsWith(ext))
    if (!extension) return `${filePath}${modifier}`
    
    return `${filePath.slice(0, -extension.length)}${modifier}${extension}`
}

/**
 * Config schema with layered transforms (Zod-like API).
 */
export const configSchema = defineConfig<ConfigDefinition>()
    // Step 1: Derive environment and apply theme-based icon modifier
    .transform(config => ({
        ...config,
        environment: environment.isDevelopment
            ? config.overrideEnvironment
            : ("production" as const),
        appIcon:
            environment.appearance === "dark"
                ? addDarkModifierToFilePath(config.appIcon)
                : config.appIcon
    }))
    // Step 2: Derive base URL from environment
    .transform(config => ({
        ...config,
        baseUrl:
            config.environment === "development"
                ? config.developmentBaseUrl
                : config.productionBaseUrl
    }))
    // Step 3: Derive all endpoint URLs from base URL
    .transform(config => ({
        ...config,
        rpcEndpoint: `${config.baseUrl}/rpc`,
        oauthAuthorizationEndpoint: `${config.baseUrl}/api/auth/oauth2/authorize`,
        oauthTokenEndpoint: `${config.baseUrl}/api/auth/oauth2/token`,
        oauthUserInfoEndpoint: `${config.baseUrl}/api/auth/oauth2/userinfo`,
        oauthRevokeEndpoint: `${config.baseUrl}/api/auth/oauth2/revoke`
    }))

// Type exports
export type ConfigDef = ConfigDefinition
export type Config = ReturnType<typeof configSchema.create>
```

**Usage in `index.ts`:**

```typescript
import { configSchema, type Config, type ConfigDef } from "./schema"

export const configDef = {
    cwd: "/Users/inducingchaos/Workspace/containers/altered/apps/launcher",
    overrideEnvironment: "development",
    // ... rest of config
} satisfies ConfigDef

export const config: Config = configSchema.create(configDef)

// Re-export types for convenience
export type { Config, ConfigDef }
```

**Key advantages:**

1. **Chainable API:** Mirrors Zod's `.transform()` pattern exactly
2. **Type accumulation:** Each transform builds on previous types
3. **Layered spreads:** Clean separation of transformation steps
4. **No manual type definitions:** `Config` type inferred from transforms
5. **Reusable:** `defineConfig` can be extracted to shared utils for other configs
6. **No circular imports:** Schema in `schema.ts`, config object in `index.ts`

**Future refactoring:** Extract `defineConfig` + `ConfigBuilder` to `~/shared/utils/define-config.ts` for reuse across the app.

**Impact:** Removes ~30-50KB of Zod from every command bundle.

---

## Implementation Order

Implement one item at a time. Stop after each for review and commit.

1. **Critical (Session 1):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ `useThoughtsQueryOptions` - Add `useMemo` (5 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Create `formatDate` utility with preset formatters (10 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ `thoughts` array - Add `useMemo` (2 min)

2. **High Priority (Session 2):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Handler functions - Add `useCallback` (10 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ `actionProps` - Add `useMemo` (5 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Accessories array caching with Map + useRef (15 min)

3. **High Priority Continued (Session 3):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Mutation options - Memoize with callbacks (25 min)

4. **Medium Priority (Session 4):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ ActionPaletteProvider context value (10 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ `systems`/`filteredSystems` memoization (5 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ `findAction` callback (2 min)

5. **Documentation & Bundle Optimization (Session 5):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ MutationQueueProvider - Add JSDoc (2 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Remove Zod from logger constants (5 min)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ✅ Remove Zod from config schema, create transform helper (30 min)

---

## Testing Strategy

After each fix:

1. Run `pnpm dev` in launcher
2. Load 500+ thoughts
3. Monitor memory usage (Activity Monitor)
4. Scroll through list rapidly
5. Check for UI lag or crashes
6. Use React DevTools Profiler if available

**Success Criteria:**

- Memory stable at 990+ thoughts
- No UI lag when scrolling
- No unnecessary re-renders when typing in search