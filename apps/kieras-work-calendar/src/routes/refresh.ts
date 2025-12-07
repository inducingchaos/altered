/**
 * Manual refresh endpoint handler. Supports both GET and POST methods.
 */

import type { Context } from "elysia"
import { fetchAndParseCalendar } from "../lib/calendar"

export async function handleRefresh({ headers, set }: Context) {
    const authSecret = process.env.REFRESH_SECRET
    const providedSecret = headers["x-refresh-secret"]
    const qstashSignature = headers["upstash-signature"]

    // Allow QStash webhooks or manual refresh with secret
    const isQStash = qstashSignature && process.env.QSTASH_CURRENT_SIGNING_KEY
    const isManual = authSecret && providedSecret === authSecret

    if (!isQStash && !isManual) {
        set.status = 401
        return { error: "Unauthorized" }
    }

    try {
        console.log(`[Refresh] Starting calendar refresh at ${new Date().toISOString()}`)
        const events = await fetchAndParseCalendar()
        console.log(`[Refresh] Calendar refresh completed: ${events.length} events`)
        set.status = 200
        return {
            success: true,
            message: "Calendar refreshed",
            timestamp: new Date().toISOString(),
            eventCount: events.length
        }
    } catch (error) {
        console.error(`[Refresh] Calendar refresh failed:`, error)
        set.status = 500
        return {
            error: "Failed to refresh calendar",
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
