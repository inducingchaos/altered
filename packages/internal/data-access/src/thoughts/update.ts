/**
 *
 */

import type { QueryableThought, UpdatableThought } from "@altered/data/shapes"
import { type Database, thoughts } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and, eq } from "drizzle-orm"

export async function updateThought({
    query,
    values,
    context
}: {
    query: QueryableThought & {
        brainId: string
    }
    values: UpdatableThought
    context: { db: Database }
}) {
    const [updatedThought] = await context.db
        .update(thoughts)
        .set(values)
        .where(
            and(eq(thoughts.id, query.id), eq(thoughts.brainId, query.brainId))
        )
        .returning()

    if (!updatedThought)
        throw new ORPCError("NOT_FOUND", {
            message:
                "Thought not found or you do not have permission to update it."
        })

    return updatedThought
}
