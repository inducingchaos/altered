/**
 *
 */

import type {
    CursorPaginationOptions,
    OffsetPaginationOptions,
    PaginationOptions,
    Thought
} from "@altered/data/shapes"
import { type Database, thoughts } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and, desc, eq, lt } from "drizzle-orm"
import { resolveCursorDefinition } from "./resolve-cursor"

const handleOffsetPagination = async ({
    pagination,
    db,
    brainId,
    limit,
    fetchLimit
}: {
    pagination: OffsetPaginationOptions
    db: Database
    brainId: string
    limit: number
    fetchLimit: number
}) => {
    const offsetThoughts = await db.query.thoughts.findMany({
        where: { brainId },
        orderBy: { createdAt: "desc" },
        limit: fetchLimit,
        offset: pagination.offset
    })

    if (!offsetThoughts.length) return { thoughts: null, hasMore: false }

    const hasMore = offsetThoughts.length > limit
    const thoughts = hasMore ? offsetThoughts.slice(0, limit) : offsetThoughts

    return { thoughts, hasMore }
}

const handleCursorPagination = async ({
    pagination,
    db,
    brainId,
    limit,
    fetchLimit
}: {
    pagination: CursorPaginationOptions
    db: Database
    brainId: string
    limit: number
    fetchLimit: number
}) => {
    if (!pagination.cursors?.length) {
        const initialThoughts = await db.query.thoughts.findMany({
            where: { brainId },
            orderBy: { createdAt: "desc" },
            limit: fetchLimit
        })

        if (!initialThoughts.length) return { thoughts: null, hasMore: false }

        const hasMore = initialThoughts.length > limit
        const thoughts = hasMore
            ? initialThoughts.slice(0, limit)
            : initialThoughts

        return { thoughts, hasMore }
    }

    for (const cursor of pagination.cursors) {
        const cursorDate = await resolveCursorDefinition(cursor, {
            strategy: "creation-date",
            context: { brainId, db }
        })

        if (!cursorDate) continue

        const afterCursorThoughts = await db
            .select()
            .from(thoughts)
            .where(
                and(
                    eq(thoughts.brainId, brainId),
                    lt(thoughts.createdAt, cursorDate)
                )
            )
            .orderBy(desc(thoughts.createdAt))
            .limit(fetchLimit)

        if (!afterCursorThoughts.length) continue

        const hasMore = afterCursorThoughts.length > limit
        const resultThoughts = hasMore
            ? afterCursorThoughts.slice(0, limit)
            : afterCursorThoughts

        return { thoughts: resultThoughts, hasMore }
    }

    return { thoughts: null, hasMore: false }
}

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
}): Promise<{
    thoughts: Thought[] | null
    hasMore: boolean
}> {
    try {
        if (!brainId) return { thoughts: null, hasMore: false }

        const limit = pagination.limit ?? 25
        /**
         * Fetches an additional item to determine if there are more pages to fetch after this one without a separate query.
         */
        const fetchLimit = limit + 1

        if (pagination.type === "offset")
            return await handleOffsetPagination({
                pagination,
                db,
                brainId,
                limit,
                fetchLimit
            })

        if (pagination.type === "cursor")
            return await handleCursorPagination({
                pagination,
                db,
                brainId,
                limit,
                fetchLimit
            })

        throw new Error("Invalid pagination type.")
    } catch (error) {
        console.error("Error retrieving thoughts:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
