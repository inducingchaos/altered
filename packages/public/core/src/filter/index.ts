/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { DatasetID } from "../altered-datasets"

export type GenericFilterOptions<
    IncludeOptions extends Record<string, unknown>
> = {
    include?: IncludeOptions
}

export type ThoughtsFilterOptions = GenericFilterOptions<{
    datasets?: DatasetID[]
}>
