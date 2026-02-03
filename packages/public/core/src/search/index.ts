/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { SearchableThoughtKey } from "../altered-thoughts"

export type SearchOptions<KeyPath extends string> = {
    query?: string
    keyPaths?: KeyPath[]
    fuzzy?: boolean
}

export type ThoughtsSearchOptions = SearchOptions<SearchableThoughtKey>
