/**
 *
 */

import { isNanoid } from "@altered/utils"
import type { InternalCreatableThought } from "@altered-internal/data/shapes"
import {
    type Database,
    thoughts as thoughtsTable
} from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

/**
 * @todo [P3] Allow passing a specific `brainId` to create Thoughts in a different Brain, with validation that the Brain exists and that the user has write permissions.
 */
export async function createManyThoughts({
    thoughts,
    db
}: {
    thoughts: InternalCreatableThought[]
    db: Database
}) {
    if (thoughts.length === 0) return []

    for (const thought of thoughts) {
        if (thought.id && !isNanoid(thought.id)) {
            throw new ORPCError("BAD_REQUEST", {
                message: "Invalid ID format.",
                cause: { thought }
            })
        }
    }

    try {
        const createdThoughts = await db
            .insert(thoughtsTable)
            .values(thoughts)
            .returning()

        if (createdThoughts.length !== thoughts.length) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Failed to create thoughts."
            })
        }

        return createdThoughts
    } catch (error) {
        console.error("Error creating thoughts:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
