/**
 *
 */

import { DateTime } from "luxon"
import ical from "ical-generator"
import { CalendarEvent } from "./parser"
import { config } from "../config"

function buildEventDescription(event: CalendarEvent): string {
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

    return description
}

function buildEventLocation(event: CalendarEvent): string {
    return event.facility + (event.address ? `, ${event.address}` : "")
}

function createEventDates(event: CalendarEvent): { start: Date; end: Date } {
    const timezone = config.app.timezone

    const start = DateTime.fromISO(`${event.date}T${event.startTime}:00`, { zone: timezone })
    let end = DateTime.fromISO(`${event.date}T${event.endTime}:00`, { zone: timezone })

    if (end <= start) {
        end = end.plus({ days: 1 })
    }

    return { start: start.toJSDate(), end: end.toJSDate() }
}

export function generateICS(events: CalendarEvent[]): string {
    const calendar = ical({ name: config.app.calendarName })

    for (const event of events) {
        const { start, end } = createEventDates(event)

        calendar.createEvent({
            id: event.id,
            start,
            end,
            summary: event.title,
            description: buildEventDescription(event),
            location: buildEventLocation(event),
            url: event.mapUrl,
            timezone: config.app.timezone
        })
    }

    return calendar.toString()
}
