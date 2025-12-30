/**
 *
 */

import { Database, thoughts } from "@altered-internal/data/store"
import { PaginationOptions, Thought } from "@altered/data/shapes"
import { ORPCError } from "@orpc/client"
import { and, desc, eq, lt } from "drizzle-orm"
import { resolveCursorDefinition } from "./resolve-cursor"

/**
 * @todo [P3] Should remove null type for `brainId` once we properly initialize a brain in an onboarding flow or middleware (should also change context type).
 *
 * @todo [P4] Consolidate error and logging types everywhere, once MVP is stable.
 */
export async function getThoughts({
    pagination,
    context: { brainId, db }
}: {
    pagination: PaginationOptions
    context: {
        brainId: string | null
        db: Database
    }
}): Promise<Thought[] | null> {
    try {
        if (!brainId) return null

        const limit = pagination.limit ?? 25

        if (pagination.type === "offset") {
            const offsetThoughts = await db.query.thoughts.findMany({
                where: { brainId },
                orderBy: { createdAt: "desc" },
                limit,
                offset: pagination.offset
            })

            if (!offsetThoughts.length) return null

            return offsetThoughts
        }

        if (pagination.type === "cursor") {
            if (!pagination.cursors?.length) {
                const initialThoughts = await db.query.thoughts.findMany({
                    where: { brainId },
                    orderBy: { createdAt: "desc" },
                    limit
                })

                if (!initialThoughts.length) return null

                return initialThoughts
            }

            for (const cursor of pagination.cursors) {
                const cursorDate = await resolveCursorDefinition(cursor, { strategy: "creation-date", context: { brainId, db } })

                if (!cursorDate) continue

                const afterCursorThoughts = await db
                    .select()
                    .from(thoughts)
                    .where(and(eq(thoughts.brainId, brainId), lt(thoughts.createdAt, cursorDate)))
                    .orderBy(desc(thoughts.createdAt))
                    .limit(limit)

                if (!afterCursorThoughts.length) continue

                return afterCursorThoughts
            }

            return null
        }

        throw new Error("Invalid pagination type.")
    } catch (error) {
        console.error(`Error retrieving thoughts:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
