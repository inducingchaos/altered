/**
 *
 */

import { Database } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

/**
 * @todo [P3] Should remove null type for `brainId` once we properly initialize a brain in an onboarding flow or middleware (should also change context type).
 */
export async function getThoughts({ ctx: { brainId, db }, query: { offset = 0, limit = 25 } }: { ctx: { brainId: string | null; db: Database }; query: { offset?: number; limit?: number } }) {
    try {
        if (!brainId) return null

        const thoughts = await db.query.thoughts.findMany({
            where: { brainId },
            orderBy: { createdAt: "desc" },
            limit,
            offset
        })

        if (!thoughts.length) return null

        return thoughts
    } catch (error) {
        console.error(`Error retrieving thoughts:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
