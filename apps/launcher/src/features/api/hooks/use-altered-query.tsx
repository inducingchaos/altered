/**
 *
 */

import type { APIError, APIOutputs } from "@altered/client/contract"
import type { QueryOptionsBase } from "@orpc/tanstack-query"
import { useQuery } from "@tanstack/react-query"

/**
 * A Tanstack Query wrapper for intercepting query options and results.
 *
 * @remarks Was used for global error handling - now unused. See `showVersionIncompatibleError` for more details.
 */
export function useAlteredQuery<Data = APIOutputs, Error = APIError>(
    options: QueryOptionsBase<Data, Error>
) {
    const result = useQuery(options)

    return result
}
