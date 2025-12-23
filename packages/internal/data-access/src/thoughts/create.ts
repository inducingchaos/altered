/**
 *
 */

import { InternalCreatableThought } from "@altered-internal/data/shapes"
import { Database, thoughts } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

export async function createThought({ thought, db }: { thought: InternalCreatableThought; db: Database }) {
    try {
        const [createdThought] = await db.insert(thoughts).values(thought).returning()

        if (!createdThought) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create thought" })

        return createdThought
    } catch (error) {
        console.error(`Error creating thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
