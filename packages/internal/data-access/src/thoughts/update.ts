/**
 *
 */

import { Database, thoughts } from "@altered-internal/data/store"
import type { MutableThought, QueryableThought } from "@altered/data/shapes"
import { ORPCError } from "@orpc/client"
import { and, eq } from "drizzle-orm"

export async function updateThought({
    where: query,
    values: thought,
    context
}: {
    where: QueryableThought & {
        brainId: string
    }
    values: MutableThought
    context: { db: Database }
}) {
    const [updatedThought] = await context.db
        .update(thoughts)
        .set(thought)
        .where(and(eq(thoughts.id, query.id), eq(thoughts.brainId, query.brainId)))
        .returning()

    if (!updatedThought) throw new ORPCError("NOT_FOUND", { message: "Thought not found or you do not have permission to update it." })

    return updatedThought
}
