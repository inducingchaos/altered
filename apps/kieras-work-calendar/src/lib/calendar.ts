/**
 *
 */

import { DateTime } from "luxon"
import { parseCalendarHtml, type CalendarEvent } from "./parser"
import { fetchCalendarData } from "./fetcher"
import { getFreshSession } from "./auth"
import { config } from "../config"
import { logger } from "./logger"

function generateMonthKeys(count: number): string[] {
    const now = DateTime.now().setZone(config.app.timezone)
    const months: string[] = []

    for (let i = 0; i < count; i++) {
        const date = now.plus({ months: i }).startOf("month")
        const year = date.year
        const month = String(date.month).padStart(2, "0")

        months.push(`${year}${month}01`)
    }

    return months
}

async function fetchMonthEvents(sessionKey: string, employeeId: string, venueId: string, calendarMonth: string): Promise<CalendarEvent[]> {
    const html = await fetchCalendarData({ sessionKey, employeeId, venueId, calendarMonth })

    return parseCalendarHtml(html)
}

export async function fetchAndParseCalendar(): Promise<CalendarEvent[]> {
    try {
        const session = await getFreshSession()
        const { sessionKey, employeeId } = session

        const venueId = config.abimm.venueId
        const months = generateMonthKeys(config.app.monthsToFetch)

        const allEvents: CalendarEvent[] = []

        for (const calendarMonth of months) {
            try {
                const events = await fetchMonthEvents(sessionKey, employeeId, venueId, calendarMonth)

                allEvents.push(...events)
            } catch (error) {
                logger.error("Failed to fetch month events", { calendarMonth, error })

                throw error
            }
        }

        return allEvents
    } catch (error) {
        logger.error("Calendar fetch and parse failed", error)

        throw error
    }
}
