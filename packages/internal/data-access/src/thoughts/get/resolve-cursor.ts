/**
 *
 */

import type { CursorDefinition } from "@altered/data/shapes"
import { type Database, thoughts } from "@altered-internal/data/store"
import { and, eq, type SQL } from "drizzle-orm"

export async function resolveCursorDefinition(
    cursor: CursorDefinition,
    {
        strategy,
        context
    }: {
        strategy: "creation-date"
        context: { brainId: string; db: Database }
    }
): Promise<Date | null> {
    if (strategy !== "creation-date")
        throw new Error("Cursor resolution strategy not implemented.")

    if (cursor.field === "created-at") return cursor.value

    const query: SQL[] = []

    if (cursor.field === "id") query.push(eq(thoughts.id, cursor.value))

    const [thought] = await context.db
        .select({ createdAt: thoughts.createdAt })
        .from(thoughts)
        .where(and(eq(thoughts.brainId, context.brainId), ...query))

    if (!thought) return null

    return thought.createdAt
}
