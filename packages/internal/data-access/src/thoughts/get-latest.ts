/**
 *
 */

import type { Database } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

/**
 * @todo [P3] Should remove null type for `brainId` once we properly initialize a brain in an onboarding flow or middleware (should also change context type).
 */
export async function getLatestThought({
    brainId,
    db
}: {
    brainId: string | null
    db: Database
}) {
    try {
        if (!brainId) return null

        const thought = await db.query.thoughts.findFirst({
            orderBy: { createdAt: "desc" },
            where: { brainId }
        })

        if (!thought) return null

        return thought
    } catch (error) {
        console.error("Error retrieving latest thought:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
