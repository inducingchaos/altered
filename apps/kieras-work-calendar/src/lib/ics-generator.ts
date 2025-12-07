/**
 * Generates ICS (iCalendar) file content from calendar events
 */

import { CalendarEvent } from "./parser"
import ical, { ICalCalendar, ICalEvent } from "ical-generator"

/**
 * Generates ICS file content from calendar events
 */
export function generateICS(events: CalendarEvent[]): string {
    const calendar = ical({ name: "Work Schedule" })

    for (const event of events) {
        const startDateTime = new Date(`${event.date}T${event.startTime}:00`)
        const endDateTime = new Date(`${event.date}T${event.endTime}:00`)

        // Handle end time that might be next day (e.g., 11:00 pm - 12:00 am)
        if (endDateTime <= startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1)
        }

        let description = `Facility: ${event.facility}`
        if (event.address) {
            description += `\nAddress: ${event.address}`
        }
        if (event.notes) {
            description += `\n\n${event.notes}`
        }
        if (event.mapUrl) {
            description += `\n\nMap: ${event.mapUrl}`
        }

        calendar.createEvent({
            id: event.id,
            start: startDateTime,
            end: endDateTime,
            summary: event.title,
            description,
            location: event.facility + (event.address ? `, ${event.address}` : ""),
            url: event.mapUrl,
            timezone: "America/Edmonton" // Adjust as needed
        })
    }

    return calendar.toString()
}
