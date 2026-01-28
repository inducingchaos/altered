---
name: Reduce Bundle Size
overview: Reduce Raycast extension command bundle sizes from ~6MB each to under 1MB by creating lean @altered/core and @altered/client packages without heavy dependencies (arktype, zod, AI SDK).
todos:
  - id: create-core-pkg
    content: Create @altered/core package with base types (Thought, ALTEREDAction, etc.) - no runtime deps
    status: completed
  - id: create-client-pkg
    content: Create @altered/client package with oRPC utilities, filterSystems, createOrpcErrorLogger
    status: completed
  - id: update-launcher-deps
    content: Update launcher to depend on @altered/core and @altered/client instead of harness/data-shapes/utils
    status: completed
  - id: update-launcher-imports
    content: Update all launcher imports to use new packages
    status: completed
  - id: remove-better-auth
    content: Remove better-auth from launcher dependencies
    status: completed
  - id: remove-luxon
    content: Remove luxon from launcher, replace with native Intl.DateTimeFormat
    status: completed
  - id: validate-bundle
    content: Run dev build and verify bundle sizes reduced
    status: completed
  - id: memoize-query-options
    content: Wrap useThoughtsQueryOptions return in useMemo to prevent recreation
    status: pending
  - id: audit-view-thoughts-memoization
    content: Systematically audit view-thoughts command for unstable references, missing useMemo/useCallback
    status: pending
  - id: audit-view-thoughts-memory
    content: Identify memory-intensive patterns (large arrays, nested instantiations)
    status: pending
isProject: false
---

# Reduce Raycast Extension Bundle Size

## Problem Analysis

Current bundle sizes per command: **~6MB each** (total ~46MB for 8 commands)

Heavy dependencies bundled into every command:

- **arktype + @ark** (~100 refs): from `@altered/harness`, `@altered/data/shapes`
- **zod** (~77 refs): from `ai` SDK via `@altered/utils`, `better-auth`
- **stream-json** (~10 refs): from `@raycast/utils` (unavoidable, needed for OAuth/caching)
- **node-fetch, cross-fetch** (~2 refs): fetch polyfills

**Key insight**: The launcher only needs:

- TypeScript types (`Thought`, `ALTEREDAction`, etc.)
- `filterSystems` utility (87 lines, no deps)
- `createOrpcErrorLogger` utility (no heavy deps)
- oRPC client (`@orpc/client` - lightweight)
- Luxon for date formatting (~70KB - acceptable)

## Strategy

Create new lean packages from scratch. **Leave existing packages unchanged** - they continue to use ArkType for server-side validation.

```mermaid
graph TD
    subgraph current [Current: Everything Bundled]
        L[Launcher] --> H[@altered/harness]
        L --> DS[@altered/data/shapes]
        L --> U[@altered/utils]
        H --> AT1[arktype]
        DS --> AT2[arktype]
        U --> AI[ai SDK]
        AI --> Z[zod]
    end
    
    subgraph proposed [Proposed: Lean Client Bundle]
        L2[Launcher] --> Core[@altered/core]
        L2 --> Client[@altered/client]
        Core -.-> |"types only"| NoDeps[No Dependencies]
        Client --> ORPC[@orpc/client]
        Client --> Core
    end
```

---

## Part 1: Minimal Viable Fix (Today)

### Step 1: Create @altered/core Package

Location: `packages/public/core/`

```
packages/public/core/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── thoughts.ts
    ├── actions.ts
    ├── systems.ts
    ├── interfaces.ts
    ├── components.ts
    ├── operations.ts
    ├── constructs.ts
    ├── pagination.ts
    └── api-keys.ts
```

**package.json** - Zero runtime dependencies:

```json
{
    "name": "@altered/core",
    "version": "0.1.0",
    "private": false,
    "main": "src/index.ts",
    "types": "src/index.ts",
    "exports": {
        ".": "./src/index.ts"
    },
    "devDependencies": {
        "@altered-internal/typescript": "workspace:*",
        "typescript": "catalog:typescript"
    }
}
```

**Key types to include** (manually defined, not inferred from ArkType):

```typescript
// src/thoughts.ts
export type Thought = {
    id: string
    alias: string | null
    content: string | null
    createdAt: Date
    updatedAt: Date
    addedAt: Date
}

export type CreatableThought = Omit<Thought, "addedAt"> & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

export type UpdatableThought = Omit<Thought, "id" | "createdAt" | "updatedAt" | "addedAt">
export type QueryableThought = Pick<Thought, "id">
```

### Step 2: Create @altered/client Package

Location: `packages/public/client/`

```
packages/public/client/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── utils/
    │   ├── index.ts
    │   ├── filter-systems.ts
    │   └── orpc-error-logger.ts
    └── contracts/
        ├── index.ts
        ├── thoughts.ts
        ├── auth.ts
        ├── ai.ts
        ├── aggregate.ts
        └── experimental.ts
```

**package.json** - Minimal deps:

```json
{
    "name": "@altered/client",
    "version": "0.1.0",
    "private": false,
    "main": "src/index.ts",
    "types": "src/index.ts",
    "exports": {
        ".": "./src/index.ts",
        "./utils": "./src/utils/index.ts",
        "./contracts": "./src/contracts/index.ts"
    },
    "dependencies": {
        "@altered/core": "workspace:*",
        "@orpc/contract": "catalog:orpc"
    },
    "devDependencies": {
        "@altered-internal/typescript": "workspace:*",
        "typescript": "catalog:typescript"
    }
}
```

**Contracts using `type<T>()` instead of ArkType**:

```typescript
// src/contracts/thoughts.ts
import type { Thought, CreatableThought, QueryableThought, UpdatableThought } from "@altered/core"
import { oc, type } from "@orpc/contract"

const contractFactory = oc

export const thoughtsContract = {
    get: contractFactory
        .route({ tags: ["internal"] })
        .input(type<{ pagination: { cursor?: string; limit?: number } }>())
        .output(type<{ thoughts: Thought[] | null; hasMore: boolean }>()),

    create: contractFactory
        .route({ tags: ["internal"] })
        .input(type<CreatableThought>())
        .output(type<{ thought: Thought }>()),

    // ... etc
}
```

**Utilities** (copy from existing packages):

```typescript
// src/utils/filter-systems.ts
import type { ALTEREDAction, ALTEREDSystem } from "@altered/core"
// ... (copy existing implementation, ~87 lines)

// src/utils/orpc-error-logger.ts
import { ORPCError } from "@orpc/contract"
// ... (copy existing implementation, ~70 lines)
```

### Step 3: Update Launcher Dependencies

**apps/launcher/package.json**:

```diff
dependencies:
-   "@altered/data/shapes": "workspace:*",
-   "@altered/harness": "workspace:*",
-   "@altered/utils": "workspace:*",
+   "@altered/core": "workspace:*",
+   "@altered/client": "workspace:*",
    "@orpc/client": "catalog:orpc",
    "@orpc/tanstack-query": "catalog:orpc",
    "@raycast/api": "^1.103.6",
    "@raycast/utils": "^1.17.0",
    "@tanstack/query-persist-client-core": "catalog:tanstack-query",
    "@tanstack/react-query": "catalog:tanstack-query",
-   "better-auth": "catalog:better-auth",
    "luxon": "^3.7.2",
    "nanoid": "^5.1.6",
    "zustand": "^5.0.9"
```

### Step 4: Update Launcher Imports

Find and replace across all launcher files:

```typescript
// Before
import type { Thought } from "@altered/data/shapes"
import type { APIError, APIOutputs, ContractRouterClient } from "@altered/harness"
import { createOrpcErrorLogger } from "@altered/harness"
import { filterSystems } from "@altered/utils"

// After
import type { Thought } from "@altered/core"
import type { APIContract, APIError, APIOutputs } from "@altered/client/contract"
import { createOrpcErrorLogger, filterSystems } from "@altered/client/utils"
```

### Step 5: Run pnpm install and Dev Build

```bash
cd /Users/inducingchaos/Workspace/containers/altered
pnpm install
cd apps/launcher
pnpm dev
```

### Step 6: Validate Bundle Sizes

```bash
# Check individual command bundle sizes
find ~/.config/raycast/extensions/altered-launcher/ -type f -name "*.js" -exec du -h {} \; | sort -rh | head -20

# Verify heavy deps are gone (should return 0 or very low)
grep -c "arktype\|@ark/" ~/.config/raycast/extensions/altered-launcher/view-thoughts.js
grep -c "zod" ~/.config/raycast/extensions/altered-launcher/view-thoughts.js
```

**Expected results:**

- Bundle per command: **~500KB - 1MB** (down from ~6MB)
- Total extension: **~4-8MB** (down from ~46MB)
- Memory on load: **~10-15MB** (down from ~55MB)

### Part 1 Results & Insights

**Actual Results Achieved (Jan 27, 2026):**

- Bundle per command: **4.7MB** (down from 6.5MB, -27%)
- Total extension: **37MB** (down from 46MB, -20%)
- Memory capacity: **990+ thoughts** (up from ~125, 7.4x improvement)
- Lines of code per command: **~29,285** (down from ~35,789, -18%)

**Additional Optimizations:**

1. ✅ **Removed Luxon** (4.5MB) - Replaced with native `Intl.DateTimeFormat`

   - Bundle savings: ~1.1MB per command
   - Memory savings: ~0.17MB for 1000 DateTime instances vs native Date objects
   - Trade-off: Lost date manipulation helpers (`.plus()`, `.fromFormat()`, etc.)
   - Acceptable for display-only use cases

2. ✅ **Fixed corrupted node_modules**

   - ANSI escape codes appearing in terminal output
   - Reinstalling dependencies resolved terminal formatting + potential memory leaks

3. ✅ **Removed per-item ActionPanel**

   - Original issue: Creating 900× closures for every thought in list
   - Now: Only list-level actions (~10 functions per render)

**Key Insights:**

#### 1. Bundle Size Reality Check

The initial goal of <1MB per command was **unrealistic** due to Raycast's bundler limitations:

- **Raycast uses CommonJS** (not ESM) → Poor tree-shaking
- **No shared modules** between commands → Each command bundles React runtime independently
- **"Appears 64x"** doesn't mean 64 copies of code - it means 64 string references to package paths
- When you import one function from a package, **the entire package is bundled**

**Bundle Breakdown (estimated):**

```
Total per command: ~4.7MB
├── React runtime: ~2MB
├── TanStack Query: ~1.5MB
├── @raycast/utils: ~1.1MB
├── @orpc/client: ~0.3MB
├── Raycast API: ~0.5MB
└── Application code: ~0.3MB
────────────────────────
Raycast overhead: ~4.4MB (93%)
Your code: ~0.3MB (7%)
```

**The 37MB total is largely Raycast's fault**, not our code.

#### 2. Memory vs Bundle Size

Bundle size ≠ memory usage. The real memory killers were:

1. **Library initialization overhead** - Luxon's timezone data, locale support loaded into memory
2. **Per-item instance creation** - Creating `DateTime.fromJSDate()` for 900 rows
3. **Unstable references** - Query options recreated every render, creating closure garbage
4. **React render tree** - 900 List.Items with nested components (ActionPanels, Details, Accessories)

**Removing Luxon helped because:**

- Smaller bundle → Less code to parse/evaluate on command load
- Native Date objects → Lower per-instance memory footprint
- No timezone/locale data → Saved baseline memory overhead

#### 3. Memoization Issues Discovered

**Critical finding**: `useThoughtsQueryOptions` was recreating the entire query config every render:

```typescript
// ❌ BAD - Creates new object every render
export function useThoughtsQueryOptions(props) {
    return router.thoughts.get.infiniteOptions({ ... })
}

// ✅ GOOD - Stable reference
export function useThoughtsQueryOptions(props) {
    return useMemo(() => router.thoughts.get.infiniteOptions({ ... }), [authToken])
}
```

**Impact**: For 900 thoughts × multiple renders = megabytes of closure garbage waiting for GC.

#### 4. When Intl is Sufficient vs Need Luxon

**Stick with native Intl API for:**

- ✅ Display formatting (`Intl.DateTimeFormat`)
- ✅ Timezone conversions (handled natively)
- ✅ Relative time (`Intl.RelativeTimeFormat`)
- ✅ Locale-aware formatting

**Need Luxon/date-fns for:**

- ❌ Date math (`.plus({days: 5})`, `.startOf('week')`)
- ❌ Custom parsing (`.fromFormat("01/26/26", "MM/dd/yy")`)
- ❌ Intervals/Durations (`.between()`, `.diff()`)
- ❌ Manipulation helpers (`.endOf('month')`)

**For web apps with hydration**: Send ISO strings from server, format on client with Intl.

#### 5. TanStack Query & @raycast/utils Are Worth Keeping

**TanStack Query (1.5MB)**:

- Advertised as "14KB" = minified+gzipped core only
- You use: infinite queries, mutations, cache persistence = 28 files bundled
- **Worth every byte** for your feature set

**@raycast/utils (1.1MB)**:

- Bundles 31 files due to internal dependencies
- You use: `useForm` (complex form state), `withAccessToken` (OAuth HOC with Suspense)
- **Not worth removing** - would need to reimplement 500+ lines of well-tested code

#### 6. Code Patterns That Affect Memory

**Good patterns we're using:**

- ✅ Removed per-item ActionPanels (prevents 900× closures)
- ✅ Using native Date instead of Luxon DateTime
- ✅ Memoizing query results in `use-thoughts.tsx`

**Patterns to fix (Part 1.5):**

- ❌ Query options recreated every render (needs `useMemo`)
- ❌ Potential inline functions in render loops
- ❌ Unmemoized computed values
- ❌ Components recreated instead of stable references

---

## Part 1.5: Systematic Memoization Audit (Next)

**Objective**: Eliminate all unstable references, closures, and unnecessary re-computations in the view-thoughts command and its dependencies.

### Scope

Audit **every import** and **every component** in the view-thoughts command tree:

```
view-thoughts/
├── index.tsx (main component)
├── use-thoughts.tsx
├── use-thoughts-query-options.tsx ⚠️ Already identified as issue
├── thought-list-actions.tsx
├── inspector.tsx
├── mutation-queue-provider.tsx
├── shared.ts
└── utils.ts
```

### Tasks

#### 1. Hook Memoization Audit

**Check all custom hooks for:**

- Missing `useMemo` on returned objects/arrays
- Missing `useCallback` on returned functions
- Dependency arrays that cause unnecessary re-runs

**Files to audit:**

- `use-thoughts.tsx` - Returns object with `thoughts`, `refresh()`, `onLoadMore()`
- `use-thoughts-query-options.tsx` - ✅ Already fixed (needs `useMemo` around return)
- Any other custom hooks in the command

**Pattern to look for:**

```typescript
// ❌ BAD - New object every render
export function useMyHook() {
    return { value: data, onChange: (v) => setData(v) }
}

// ✅ GOOD - Stable references
export function useMyHook() {
    const onChange = useCallback((v) => setData(v), [])
    return useMemo(() => ({ value: data, onChange }), [data, onChange])
}
```

#### 2. Component Memoization Audit

**Check all components for:**

- Missing `memo()` wrapper for expensive renders
- Props that change unnecessarily (causing re-renders)
- Inline component definitions (recreated every render)

**Files to audit:**

- `inspector.tsx` - Detail view component
- `thought-list-actions.tsx` - ActionPanel component
- Any child components

**Pattern to look for:**

```typescript
// ❌ BAD - Recreated every render
function Parent() {
    const Child = () => <div>Child</div>
    return <Child />
}

// ✅ GOOD - Stable component
const Child = memo(() => <div>Child</div>)
function Parent() {
    return <Child />
}
```

#### 3. Query Options Stability

**Check TanStack Query usage for:**

- Unstable query keys (recreated objects/arrays)
- Unstable query options (missing `useMemo`)
- Mutation options with inline functions

**Files to audit:**

- `index.tsx` - All `useMutation` and `useInfiniteQuery` calls
- `use-thoughts-query-options.tsx` - Query options factory

**Pattern to look for:**

```typescript
// ❌ BAD - New queryKey array every render
useQuery({
    queryKey: ['thoughts', { userId }],
    ...
})

// ✅ GOOD - Stable queryKey
const queryKey = useMemo(() => ['thoughts', { userId }], [userId])
useQuery({ queryKey, ... })
```

#### 4. Inline Function Audit

**Check for inline functions in:**

- Render loops (`.map()`, `.filter()`)
- Event handlers passed as props
- ActionPanel actions

**Files to audit:**

- `index.tsx` - Main render with thought list
- `thought-list-actions.tsx` - Action handlers
- `inspector.tsx` - Inspector actions

**Pattern to look for:**

```typescript
// ❌ BAD - New function every render, for every item
{thoughts.map(thought => (
    <Item onAction={() => handleAction(thought.id)} />
))}

// ✅ GOOD - Stable callback
const handleAction = useCallback((id: string) => {
    // handle action
}, [])

{thoughts.map(thought => (
    <Item onAction={() => handleAction(thought.id)} />
))}

// ✅ EVEN BETTER - Memoized component
const ThoughtItem = memo(({ thought, onAction }) => (
    <Item onAction={onAction} />
))

const handleAction = useCallback((id: string) => {
    // handle action
}, [])

{thoughts.map(thought => (
    <ThoughtItem thought={thought} onAction={() => handleAction(thought.id)} />
))}
```

#### 5. Memory-Intensive Pattern Audit

**Look for:**

- Large arrays being recreated unnecessarily
- Nested object/array spreads in render
- Class instantiations inside render
- Heavy computations without `useMemo`

**Pattern to look for:**

```typescript
// ❌ BAD - Recreates array every render
function Component({ items }) {
    const filtered = items.filter(i => i.active)  // Runs every render!
    return <List items={filtered} />
}

// ✅ GOOD - Memoized computation
function Component({ items }) {
    const filtered = useMemo(() => items.filter(i => i.active), [items])
    return <List items={filtered} />
}
```

#### 6. Context Provider Optimization

**Check mutation-queue-provider.tsx for:**

- Context value object recreated every render
- Missing `useMemo` on provider value
- Unnecessary renders propagating to consumers

**Pattern to look for:**

```typescript
// ❌ BAD - New context value every render
<Context.Provider value={{ queue, enqueue }}>

// ✅ GOOD - Stable context value
const value = useMemo(() => ({ queue, enqueue }), [queue, enqueue])
<Context.Provider value={value}>
```

### Implementation Strategy

1. **Start with hooks** - Fix `use-thoughts-query-options.tsx` (add `useMemo`)
2. **Audit custom hooks** - Check all hooks return stable references
3. **Profile components** - Use React DevTools Profiler to identify expensive re-renders
4. **Fix hot paths first** - Prioritize code that runs per-item (900× multiplier)
5. **Test incrementally** - Check memory usage after each fix
6. **Document trade-offs** - Some memoization adds complexity, verify it's worth it

### Success Criteria

- [ ] All query options wrapped in `useMemo` with correct dependencies
- [ ] All returned functions from hooks use `useCallback`
- [ ] All returned objects/arrays from hooks use `useMemo`
- [ ] No inline functions in render loops
- [ ] No expensive computations in render without `useMemo`
- [ ] Context providers use memoized values
- [ ] Memory usage stable when paginating to 990+ thoughts
- [ ] No unnecessary re-renders when profiled

---

## Part 2: Type Alignment & Future Hardening (As Needed)

**Objective**: Ensure `@altered/core` types stay aligned with server-side ArkType schemas in `@altered/data/shapes` without requiring runtime validation on the client.

### Strategy

Use TypeScript's `satisfies` keyword to create **compile-time checks** that prevent type drift:

```typescript
// packages/public/data-shapes/src/altered-thoughts/db.ts
import type { Thought } from "@altered/core"
import { type } from "arktype"

export const thoughtSchema = type({
    id: "string",
    alias: "string | null",
    content: "string | null",
    createdAt: "Date",
    updatedAt: "Date",
    addedAt: "Date"
})

// Compile-time check: schema inference must match canonical type
type _SchemaMatchesCore = typeof thoughtSchema.infer satisfies Thought
type _CoreMatchesSchema = Thought satisfies typeof thoughtSchema.infer
```

**Benefits:**

- TypeScript errors if types diverge
- No runtime overhead
- `@altered/core` remains the single source of truth
- `@altered/data/shapes` validates at runtime server-side
- Launcher uses lean types without validation libs

### Additional Future Work

#### 1. Version Negotiation

If client/server types drift significantly, implement API version negotiation:

```typescript
// packages/public/client/src/contracts/factory.ts
export const contractFactory = oc
    .context<{ apiVersion: string }>()
    .use((input, context, meta, next) => {
        if (context.apiVersion !== CURRENT_VERSION) {
            throw new ORPCError({
                code: 'PRECONDITION_FAILED',
                message: `API version mismatch. Client: ${CURRENT_VERSION}, Server: ${context.apiVersion}`
            })
        }
        return next(input, context, meta)
    })
```

#### 2. Shared Type Package

If type duplication becomes an issue, consider:

- Extract `@altered/core` types to `@altered/types` (pure TypeScript, no code)
- Both `@altered/core` and `@altered/data/shapes` import from `@altered/types`
- Launcher and server both use `@altered/types` directly

**Trade-off**: Adds indirection, but ensures perfect alignment.

#### 3. Contract Testing

Add tests to verify oRPC contracts match both:

- Client expectations (`@altered/client/contract`)
- Server implementations (`@altered/harness/router`)
```typescript
// packages/internal/harness/src/__tests__/contract-alignment.test.ts
import { thoughtsContract } from "@altered/client/contract"
import { thoughtsRouter } from "../router/thoughts"

describe("Contract alignment", () => {
    it("should have matching input/output types", () => {
        // Runtime validation that contract matches implementation
    })
})
```


### When to Implement Part 2

**Triggers for adding type alignment:**

- [ ] Types drift causing runtime errors
- [ ] Multiple contributors editing both packages
- [ ] Preparing for public API release
- [ ] Adding breaking changes to data models

**Current status**: Not urgent. `@altered/core` types were manually copied and are stable. Only implement if drift becomes a problem.

---

## Notes & Lessons Learned

### What Worked

- ✅ **Lean package strategy** - Separating client-only types from server validation worked perfectly
- ✅ **oRPC `type<T>()` helper** - Lightweight alternative to ArkType for contract definitions
- ✅ **Leaving existing packages unchanged** - No risk of breaking server-side code
- ✅ **Removing Luxon** - Biggest single win for bundle + memory
- ✅ **Fixing node_modules corruption** - Fresh install resolved multiple issues

### What Didn't Work (Initial Assumptions)

- ❌ **<1MB per command**: Unrealistic due to Raycast's CommonJS bundler (achieved 4.7MB, still 27% reduction)
- ❌ **"Luxon stays"**: Initially thought acceptable, but 4.5MB bundle + instance overhead made removal worth it
- ❌ **Memory is purely data-driven**: Turns out code execution (library initialization, closures) matters more than data size

### Key Takeaways

1. **Bundle size ≠ Memory usage** - Both matter, but for different reasons
2. **Tree-shaking depends on bundler** - Can't assume it works, especially with CommonJS
3. **Instance creation matters** - Creating 900 Luxon DateTimes has measurable memory impact
4. **Memoization is critical** - Unstable references create garbage faster than GC can clean up
5. **Measure, don't assume** - Use `du -h`, `grep -c`, memory profiling to validate optimizations

### Remaining Dependencies (Acceptable)

- **@raycast/utils (1.1MB)**: `useForm`, `withAccessToken` - not worth reimplementing
- **@tanstack/react-query (1.5MB)**: Core to architecture - infinite queries, mutations, persistence
- **stream-json**: Unavoidable via `@raycast/utils`, needed for OAuth/caching
- **Raycast runtime (~20-25MB)**: Extensions API, Node.js environment, React - unavoidable

### Architecture Decisions

✅ **Keep**: `@altered/harness`, `@altered/data/shapes`, `@altered/utils` unchanged (server-side)

✅ **Add**: `@altered/core` (lean types), `@altered/client` (contracts + utils) for client

✅ **Remove**: `better-auth`, `luxon`, direct imports of ArkType/Zod

✅ **Pattern**: Server validates with ArkType, client uses TypeScript-only types

This architecture allows rich server-side validation while keeping client bundles lean.