/**
 *
 */

import { type ProtectedRouteContext } from "@altered-internal/harness"
import { ORPCError } from "@orpc/client"

export async function getLatestThought({ ctx }: { ctx: ProtectedRouteContext }) {
    try {
        const thought = await ctx.db.query.thoughts.findFirst({
            orderBy: { createdAt: "desc" },
            where: { userId: ctx.auth.user.id }
        })

        return { thought: thought }
    } catch (error) {
        console.error(`Error retrieving latest thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
