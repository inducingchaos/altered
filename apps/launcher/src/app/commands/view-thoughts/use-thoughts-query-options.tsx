/**
 *
 */

import { CursorDefinition } from "@altered/data/shapes"
import { api as router } from "~/api/react"
import { config } from "~/config"

export function useThoughtsQueryOptions(props?: { authToken: string | null }) {
    const { authToken = null } = props ?? {}

    return router.thoughts.get.infiniteOptions({
        input: (pageParam: CursorDefinition | null) => ({
            pagination: {
                type: "cursor",
                cursors: pageParam ? [pageParam] : null,
                limit: config.listPaginationLimit
            }
        }),
        context: { authToken },

        initialPageParam: null,
        getNextPageParam: lastPage => {
            if (!lastPage.hasMore) return null

            const thoughts = lastPage.thoughts
            if (!thoughts || !thoughts.length) return null

            const lastThoughtIndex = thoughts.length - 1
            const lastThought = thoughts[lastThoughtIndex]

            const cursorDef: CursorDefinition = { field: "created-at", value: lastThought.createdAt }

            return cursorDef
        }
    })
}
