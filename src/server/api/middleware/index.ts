/**
 *
 */

import { ORPCError } from "@orpc/server"
import { db } from "~/server/data/connection"
import { apiFactory } from "../factory"

export const dbProvider = apiFactory.middleware(({ context, next }) => next({ context: { db } }))

/**
 * @todo [P2] Add validation for `.env` values.
 */
export const requireAuth = apiFactory.middleware(async ({ context, next }) => {
    //  Use the auth header to get the user from the database.

    const authHeader = context._.headers["authorization"] ?? "test"

    if (!process.env.USER_ID) throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: new Error("USER_ID is not set.") })

    const user = context.user ?? authHeader ? { id: process.env.USER_ID, name: "Riley" } : null

    if (user) return next({ context: { user: { id: user.id, name: user.name } } })

    throw new ORPCError("UNAUTHORIZED")
})
