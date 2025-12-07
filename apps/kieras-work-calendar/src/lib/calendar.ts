/**
 * Core calendar fetching and parsing logic
 */

import { parseCalendarHtml, type CalendarEvent } from "./parser"
import { fetchCalendarData } from "./fetcher"

export async function fetchAndParseCalendar(): Promise<CalendarEvent[]> {
    const sessionKey = process.env.ABIMM_SESSION_KEY
    const employeeId = process.env.ABIMM_EMPLOYEE_ID
    const venueId = process.env.ABIMM_VENUE_ID || "IDH"

    if (!sessionKey || !employeeId) {
        throw new Error("Missing required environment variables: ABIMM_SESSION_KEY and ABIMM_EMPLOYEE_ID")
    }

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
