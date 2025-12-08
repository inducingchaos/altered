/**
 *
 */

import type { Context } from "elysia"
import { fetchAndParseCalendar } from "../lib/calendar"
import { generateICS } from "../lib/ics-generator"
import { logger } from "../lib/logger"
import { initializeQStashSchedule } from "../lib/qstash"

function getBaseUrl(headers: Record<string, string | undefined>): string {
    const host = headers.host ?? headers["x-forwarded-host"]
    const protocol = headers["x-forwarded-proto"] ?? "https"

    if (host) {
        return `${protocol}://${host}`
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    return process.env.BASE_URL ?? "http://localhost:3000"
}

export async function handleCalendarICS({ headers, set }: Context) {
    try {
        if (process.env.QSTASH_TOKEN && !process.env.NODE_ENV?.includes("dev")) {
            const baseUrl = getBaseUrl(headers)

            initializeQStashSchedule(baseUrl).catch(error => {
                logger.error("QStash lazy initialization failed", error)
            })
        }

        const events = await fetchAndParseCalendar()
        const icsContent = generateICS(events)

        return new Response(icsContent, {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": "attachment; filename=calendar.ics",
                "Cache-Control": "public, max-age=3600"
            }
        })
    } catch (error) {
        logger.error("Calendar ICS generation failed", error)

        set.status = 500

        return {
            error: "Failed to generate calendar",
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
