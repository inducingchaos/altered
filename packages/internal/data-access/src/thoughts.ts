/**
 *
 */

import { ORPCError } from "@orpc/client"
import type { Database } from "@altered-internal/data/store"
import type { ProtectedContext } from "./context"

export async function getMostRecentBrainId({ userId, db }: { userId: string; db: Database }) {
    const preference = await db.query.systemPreferences.findFirst({
        where: {
            userId,
            key: "most-recent-brain-id"
        }
    })

    return preference?.value ?? null
}

export async function getLatestThought({
    ctx: {
        auth: {
            user: { id: userId }
        },
        db
    }
}: {
    ctx: ProtectedContext
}) {
    try {
        const brainId = await getMostRecentBrainId({
            userId,
            db
        })

        if (!brainId) return { thought: null }

        const thought = await db.query.thoughts.findFirst({
            orderBy: { createdAt: "desc" },
            where: { brainId }
        })

        if (!thought) return { thought: null }

        return { thought: thought }
    } catch (error) {
        console.error(`Error retrieving latest thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
