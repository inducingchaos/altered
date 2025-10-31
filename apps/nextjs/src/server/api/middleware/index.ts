/**
 *
 */

import { ORPCError } from "@orpc/server"
import { auth } from "~/lib/auth"
import { db } from "~/server/data/connection"
import { apiFactory } from "../factory"

export const dbProvider = apiFactory.middleware(({ next }) => next({ context: { db } }))

/**
 * @todo [P2] Add validation for `.env` values.
 */
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
