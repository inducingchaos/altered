/**
 *
 */

import { type Database, thoughts } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and, eq } from "drizzle-orm"

export async function deleteThought({
    id,
    brainId,
    db
}: {
    id: string
    brainId: string
    db: Database
}) {
    const [deletedThought] = await db
        .delete(thoughts)
        .where(and(eq(thoughts.id, id), eq(thoughts.brainId, brainId)))
        .returning()

    if (!deletedThought)
        throw new ORPCError("NOT_FOUND", {
            message:
                "Thought not found or you do not have permission to delete it."
        })

    return deletedThought
}
