---
name: Infinite Query Lazy Persistence
overview: Create a custom persister wrapper that enables page-by-page lazy restoration for infinite queries, storing all pages but only hydrating one page at a time into TanStack Query's in-memory cache.
todos:
  - id: page-cache
    content: Create in-memory page cache module with helpers for storing/retrieving individual pages
    status: pending
  - id: infinite-persister
    content: Create custom infinite query persister wrapper that handles initial restore (page 1 only) and subsequent page lookups
    status: pending
  - id: integrate-client
    content: Update QueryClient to use the new infinite query persister
    status: pending
  - id: test-verify
    content: Test with view-thoughts command to verify lazy pagination behavior
    status: pending
isProject: false
---

# Infinite Query Lazy Persistence

## Problem Analysis

The `experimental_createQueryPersister` stores and restores the **entire** `InfiniteData` object (`{ pages: [...], pageParams: [...] }`) as a single cache entry. When the query is first used:

1. `persisterFn` checks `query.state.data === undefined`
2. Retrieves ALL pages from storage
3. Returns the full `InfiniteData` at once
4. UI renders all 183 thoughts instead of 25

The "lazy" restoration only means "restore when query is first used" - not "restore page by page".

## Solution Architecture

```mermaid
flowchart TD
    subgraph storage [Raycast Cache Storage]
        FullData["Full InfiniteData\n{pages: [p1,p2,...], pageParams: [...]}"]
    end
    
    subgraph memory [In-Memory Page Cache]
        PageCache["Map<queryHash, PersistedQuery>"]
    end
    
    subgraph wrapper [Custom Persister Wrapper]
        RestoreLogic["On initial restore:\n1. Load full data into PageCache\n2. Return only page 1"]
        FetchLogic["On fetchNextPage:\n1. Check PageCache for page N\n2. If found + fresh: return cached\n3. Else: fetch from network"]
    end
    
    storage --> RestoreLogic
    RestoreLogic --> PageCache
    PageCache --> FetchLogic
    FetchLogic -->|"Cache miss/stale"| Network["Network Request"]
```



## Implementation

### Step 1: Create Page Cache Module

Create a new file [apps/launcher/src/features/api/infinite-query-page-cache.ts](apps/launcher/src/features/api/infinite-query-page-cache.ts):

- Export a `Map` to hold full persisted data keyed by `queryHash`
- Export helper functions: `getPageFromCache(queryHash, pageIndex)`, `setPageCache(queryHash, data)`
- Store `dataUpdatedAt` alongside pages to respect `staleTime`

### Step 2: Create Custom Infinite Query Persister Wrapper

Modify [apps/launcher/src/features/api/query-client.ts](apps/launcher/src/features/api/query-client.ts):

Create `createInfiniteQueryPersister()` that wraps the base `queryPersister.persisterFn`:

```typescript
function createInfiniteQueryPersister(basePersister: typeof queryPersister) {
  return async function infinitePersisterFn<T, TQueryKey extends QueryKey>(
    queryFn: (ctx: QueryFunctionContext<TQueryKey>) => T | Promise<T>,
    ctx: QueryFunctionContext<TQueryKey>,
    query: Query
  ) {
    const isInfiniteQuery = "direction" in ctx || "pageParam" in ctx
    
    if (!isInfiniteQuery) {
      // Regular queries: use base persister as-is
      return basePersister.persisterFn(queryFn, ctx, query)
    }
    
    // Infinite query handling...
  }
}
```

### Step 3: Implement Initial Restore Logic

Within the wrapper, handle first page restoration:

```typescript
// Initial restore (query.state.data === undefined)
if (query.state.data === undefined) {
  const fullPersistedData = await basePersister.retrieveQuery<InfiniteData>(query.queryHash)
  
  if (fullPersistedData) {
    // Store full data in page cache for later
    pageCache.set(query.queryHash, {
      data: fullPersistedData,
      dataUpdatedAt: /* from storage metadata */
    })
    
    // Return ONLY page 1
    return {
      pages: fullPersistedData.pages.slice(0, 1),
      pageParams: fullPersistedData.pageParams.slice(0, 1)
    } as T
  }
}
```

### Step 4: Implement Subsequent Page Fetch Logic

Handle `fetchNextPage` calls by checking page cache first:

```typescript
// Subsequent pages (query.state.data exists)
const pageIndex = getPageIndexFromParam(ctx.pageParam, query)
const cachedPage = pageCache.getPage(query.queryHash, pageIndex)

if (cachedPage && !isStale(cachedPage.dataUpdatedAt, staleTime)) {
  // Return cached page
  return cachedPage.data as T
}

// Cache miss or stale: fetch from network
const networkResult = await queryFn(ctx)
// Note: base persister will handle storing the updated data
return networkResult
```

### Step 5: Update Query Client Configuration

In [apps/launcher/src/features/api/query-client.ts](apps/launcher/src/features/api/query-client.ts):

```typescript
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // ... existing options
        persister: createInfiniteQueryPersister(queryPersister)
      }
    }
  })
```

## Key Considerations

1. **Staleness**: Use `dataUpdatedAt` from the persisted query metadata to determine if cached pages are stale
2. **Page Index Resolution**: Map `pageParam` (cursor value) to page index using `pageParams` array from cached data
3. **Cache Invalidation**: Clear page cache entry when the query is invalidated or refetched
4. **Memory Management**: Page cache is in-memory only - cleared when extension restarts (storage is the source of truth)
5. **Fallback**: If page not in cache or stale, fall through to network fetch

## Files to Modify

- [apps/launcher/src/features/api/query-client.ts](apps/launcher/src/features/api/query-client.ts) - Main implementation
- Potentially [apps/launcher/src/features/api/index.ts](apps/launcher/src/features/api/index.ts) - Export new utilities if needed

