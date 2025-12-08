/**
 *
 */

import type { Context } from "elysia"
import { DateTime } from "luxon"
import { config } from "../config"
import { fetchAndParseCalendar } from "../lib/calendar"
import { logger } from "../lib/logger"

function isQStashRequest(headers: Record<string, string | undefined>): boolean {
    return !!(headers["upstash-signature"] && config.qstash.currentSigningKey)
}

function isManualRequest(headers: Record<string, string | undefined>): boolean {
    const providedSecret = headers["x-refresh-secret"]

    return !!(config.internal.secret && providedSecret === config.internal.secret)
}

function isAuthorized(headers: Record<string, string | undefined>): boolean {
    return isQStashRequest(headers) || isManualRequest(headers)
}

export async function handleRefresh({ headers, set }: Context) {
    if (!isAuthorized(headers)) {
        set.status = 401

        return { error: "Unauthorized" }
    }

    try {
        logger.info("Calendar refresh started")

        const events = await fetchAndParseCalendar()

        logger.info("Calendar refresh completed", { eventCount: events.length })

        set.status = 200

        return {
            success: true,
            message: "Calendar refreshed",
            timestamp: DateTime.now().setZone(config.app.timezone).toISO(),
            eventCount: events.length
        }
    } catch (error) {
        logger.error("Calendar refresh failed", error)

        set.status = 500

        return {
            error: "Failed to refresh calendar",
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
