/**
 *
 */

import { ORPCError } from "@orpc/client"
import { desc, eq } from "drizzle-orm"
import { ProtectedRouteContext } from "~/server/api/context"
import { thoughts } from "../schemas"

export async function getLatestThought({ ctx }: { ctx: ProtectedRouteContext }) {
    try {
        const thought = await ctx.db.query.thoughts.findFirst({
            orderBy: desc(thoughts.createdAt),
            where: eq(thoughts.userId, ctx.auth.user.id)
        })

        return { thought: thought }
    } catch (error) {
        console.error(`Error retrieving latest thought:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
