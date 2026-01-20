/**
 *
 */

import type {
    QueryableThought,
    Thought,
    UpdatableThought
} from "@altered/data/shapes"

export type HandleUpdateThought = (props: {
    query: QueryableThought
    values: UpdatableThought
}) => void

export type HandleDeleteThought = (
    thought: Thought,
    options?: { showConfirmation?: boolean }
) => void
