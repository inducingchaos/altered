/**
 *
 */

import type { Database } from "@altered-internal/data/store"
import { eq, systemPreferences } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and } from "drizzle-orm"

export async function deleteSystemPreference({ userId, key, db }: { userId: string; key: string; db: Database }) {
    try {
        await db.delete(systemPreferences).where(and(eq(systemPreferences.userId, userId), eq(systemPreferences.key, key)))
    } catch (error) {
        console.error(`Error deleting system preference:`, error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
