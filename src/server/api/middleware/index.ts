/**
 *
 */

import { ORPCError } from "@orpc/server"
import { apiFactory } from "../factory"

export const dbProvider = apiFactory.middleware(async ({ context, next }) => {
    //  Configure the client with the database URL - replace with actual client.
    const client = context.db ?? process.env.DATABASE_URL

    try {
        // await client.connect()
        return next({ context: { db: "database-connection-type" } as typeof context })
    } finally {
        // await client.disconnect()
    }
})

export const requireAuth = apiFactory.middleware(async ({ context, next }) => {
    //  Use the auth header to get the user from the database.

    const authHeader = context._.headers["authorization"] ?? "test"
    const user = context.user ?? authHeader ? { name: "Riley" } : null

    if (user) return next({ context: { user } })

    throw new ORPCError("UNAUTHORIZED")
})
