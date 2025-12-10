/**
 *
 */

import { auth } from "@altered-internal/auth"
import { db } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/server"
import { apiFactory } from "../factory"

export const dbProvider = apiFactory.middleware(({ next }) => next({ context: { db } }))

export const requireAuth = apiFactory.middleware(
    async ({
        context: {
            _: { headers }
        },
        next
    }) => {
        const session = await auth.api.getSession({ headers })
        if (!session) throw new ORPCError("UNAUTHORIZED")

        return next({ context: { auth: session } })
    }
)
