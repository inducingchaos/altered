/**
 *
 */

import { Database } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { getMostRecentBrainId } from "../brains"

export async function getLatestThought({ userId, db }: { userId: string; db: Database }) {
    try {
        const brainId = await getMostRecentBrainId({ userId, db })

        if (!brainId) return null

        const thought = await db.query.thoughts.findFirst({
            orderBy: { createdAt: "desc" },
            where: { brainId }
        })

        if (!thought) return null

        return thought
    } catch (error) {
        console.error(`Error retrieving latest thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
