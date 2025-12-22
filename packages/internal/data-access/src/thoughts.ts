/**
 *
 */

import { ORPCError } from "@orpc/client"
import type { ProtectedContext } from "./context"

export async function getLatestThought({ ctx }: { ctx: ProtectedContext }) {
    try {
        const thought = await ctx.db.query.thoughts.findFirst({
            orderBy: { createdAt: "desc" },
            where: { userId: ctx.auth.user.id }
        })
        if (!thought) return { thought: null }

        return { thought: thought }
    } catch (error) {
        console.error(`Error retrieving latest thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
