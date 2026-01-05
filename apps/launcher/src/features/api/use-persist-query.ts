/**
 *
 */

import { type InferDataFromTag, type QueryKey, type Updater, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { queryPersister } from "./query-client"

export function usePersistQuery() {
    const queryClient = useQueryClient()

    /**
     * An alternative to Query Client's `setQueryData` that additionally persists the data to disk.
     */
    const setPersistentQueryData = useCallback(
        <Key extends QueryKey, Data = InferDataFromTag<unknown, Key>>(queryKey: Key, updater: Updater<Data | undefined, Data | undefined>): Data | undefined => {
            const result = queryClient.setQueryData<Data>(queryKey, updater)

            void queryPersister.persistQueryByKey(queryKey, queryClient)

            return result
        },
        [queryClient]
    )

    return { setPersistentQueryData }
}
