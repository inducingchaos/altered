/**
 *
 */

import { InternalCreatableThought } from "@altered-internal/data/shapes"
import { Database, thoughts } from "@altered-internal/data/store"
import { isNanoid } from "@altered/utils"
import { ORPCError } from "@orpc/client"

/**
 * @todo [P3] Allow passing a specific `brainId` to create a Thought in a different Brain, with validation that the Brain exists and that the user has write permissions.
 */
export async function createThought({ thought, db }: { thought: InternalCreatableThought; db: Database }) {
    if (thought.id && !isNanoid(thought.id)) throw new ORPCError("BAD_REQUEST", { message: "Invalid ID format." })

    try {
        const [createdThought] = await db.insert(thoughts).values(thought).returning()

        if (!createdThought) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create thought" })

        return createdThought
    } catch (error) {
        console.error(`Error creating thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
