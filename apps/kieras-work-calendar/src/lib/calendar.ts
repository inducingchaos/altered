/**
 * Core calendar fetching and parsing logic
 */

import { parseCalendarHtml, type CalendarEvent } from "./parser"
import { fetchCalendarData } from "./fetcher"
import { getFreshSession } from "./auth"

export async function fetchAndParseCalendar(): Promise<CalendarEvent[]> {
    // Get fresh session by logging in dynamically
    // This ensures we always have a valid, non-expired session key
    const session = await getFreshSession()
    const { sessionKey, employeeId } = session
    const venueId = process.env.ABIMM_VENUE_ID || "IDH"

    // Get current month and next 2 months for better coverage
    const now = new Date()
    const months: string[] = []

    for (let i = 0; i < 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        months.push(`${year}${month}01`)
    }

    const allEvents: CalendarEvent[] = []

    for (const calendarMonth of months) {
        const html = await fetchCalendarData({
            sessionKey,
            employeeId,
            venueId,
            calendarMonth
        })

        const events = parseCalendarHtml(html)
        allEvents.push(...events)
    }

    return allEvents
}
