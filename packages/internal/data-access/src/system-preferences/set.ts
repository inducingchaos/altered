/**
 *
 */

import type { Database } from "@altered-internal/data/store"
import { eq, systemPreferences } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

export async function setSystemPreference({
    userId,
    key,
    value,
    db
}: {
    userId: string
    key: string
    value: string
    db: Database
}) {
    try {
        const existing = await db.query.systemPreferences.findFirst({
            where: {
                userId,
                key
            }
        })

        if (existing) {
            const [updated] = await db
                .update(systemPreferences)
                .set({ value, updatedAt: new Date() })
                .where(eq(systemPreferences.id, existing.id))
                .returning()

            if (!updated)
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    cause: new Error("Failed to update system preference")
                })

            return updated
        }

        const [created] = await db
            .insert(systemPreferences)
            .values({ userId, key, value })
            .returning()

        if (!created)
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                cause: new Error("Failed to create system preference")
            })

        return created
    } catch (error) {
        console.error("Error setting system preference:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
