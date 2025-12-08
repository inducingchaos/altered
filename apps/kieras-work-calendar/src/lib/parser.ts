/**
 *
 */

import { DateTime } from "luxon"
import { config } from "../config"

export interface CalendarEvent {
    id: string
    date: string
    startTime: string
    endTime: string
    title: string
    facility: string
    address?: string
    notes?: string
    mapUrl?: string
}

interface EventDetail {
    event: string
    facility: string
    address?: string
    notes?: string
    mapUrl?: string
}

interface DayEvent {
    day: number
    eventId: string
    time: string
    title: string
}

function extractMonthFromTitle(html: string): { year: number; month: number } {
    const monthMatch = html.match(/<span class="MonthTitle">([^<]+)<\/span>/)

    if (!monthMatch) {
        const now = DateTime.now().setZone(config.app.timezone)

        return { year: now.year, month: now.month }
    }

    const titleMatch = monthMatch[1].match(/(\w+)\s+(\d{4})/)

    if (!titleMatch) {
        const now = DateTime.now().setZone(config.app.timezone)

        return { year: now.year, month: now.month }
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const monthName = titleMatch[1]
    const month = monthNames.indexOf(monthName) + 1
    const year = parseInt(titleMatch[2], 10)

    return { year, month }
}

function extractDayEvents(html: string): DayEvent[] {
    const pattern = /<td class="calendar_day_box">\s*(\d+)\s*<div class="day_details"><a[^>]*showDetails\(['"](\d+)['"]\)[^>]*>([^<]+)<\/a><br[^>]*>&nbsp;&nbsp;([^<]+)<br>/g

    const events: DayEvent[] = []
    let match

    while ((match = pattern.exec(html)) !== null) {
        events.push({
            day: parseInt(match[1], 10),
            eventId: match[2],
            time: match[3].trim(),
            title: match[4].trim()
        })
    }

    return events
}

function extractHiddenField(html: string, pattern: RegExp): Map<string, string> {
    const map = new Map<string, string>()
    let match

    while ((match = pattern.exec(html)) !== null) {
        map.set(match[1], match[2])
    }

    return map
}

function buildEventDetails(html: string): Map<string, EventDetail> {
    const eventIdPattern = /<div id="(\d+)evt">([^<]+)<\/div>/g
    const facilityPattern = /<div id="(\d+)fac">([^<]+)<\/div>/g
    const addressPattern = /<div id="(\d+)addr">([^<]+(?:<br\/>[^<]*)*)<\/div>/g
    const notePattern = /<div id="(\d+)note">([^<]*)<\/div>/g
    const mapPattern = /<div id="(\d+)map">([^<]+)<\/div>/g

    const eventNames = extractHiddenField(html, eventIdPattern)
    const facilities = extractHiddenField(html, facilityPattern)
    const addresses = extractHiddenField(html, addressPattern)
    const notes = extractHiddenField(html, notePattern)
    const mapUrls = extractHiddenField(html, mapPattern)

    const details = new Map<string, EventDetail>()

    const allIds = new Set([...eventNames.keys(), ...facilities.keys(), ...addresses.keys(), ...notes.keys(), ...mapUrls.keys()])

    for (const id of allIds) {
        const address = addresses
            .get(id)
            ?.replace(/<br\/>/gi, ", ")
            .replace(/\s+/g, " ")
            .trim()

        const note = notes.get(id)?.trim()

        details.set(id, {
            event: eventNames.get(id) ?? "",
            facility: facilities.get(id) ?? "",
            address: address ?? undefined,
            notes: note ?? undefined,
            mapUrl: mapUrls.get(id) ?? undefined
        })
    }

    return details
}

function parseTimeRange(timeStr: string): { start: string; end: string } | null {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)\s*-\s*(\d{1,2}):(\d{2})\s*(am|pm)/i)
    if (!match) return null

    const to24Hour = (hour: number, period: string): number => {
        if (period === "pm" && hour !== 12) return hour + 12
        if (period === "am" && hour === 12) return 0

        return hour
    }

    const startHour = to24Hour(parseInt(match[1], 10), match[3].toLowerCase())
    const startMinute = parseInt(match[2], 10)
    const endHour = to24Hour(parseInt(match[4], 10), match[6].toLowerCase())
    const endMinute = parseInt(match[5], 10)

    return {
        start: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
        end: `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`
    }
}

function formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function parseCalendarHtml(html: string): CalendarEvent[] {
    const { year, month } = extractMonthFromTitle(html)
    const dayEvents = extractDayEvents(html)
    const eventDetails = buildEventDetails(html)

    const events: CalendarEvent[] = []

    for (const dayEvent of dayEvents) {
        const timeRange = parseTimeRange(dayEvent.time)
        if (!timeRange) continue

        const detail = eventDetails.get(dayEvent.eventId)
        const dateStr = formatDate(year, month, dayEvent.day)

        events.push({
            id: `${dateStr}-${dayEvent.eventId}-${dayEvent.title}`,
            date: dateStr,
            startTime: timeRange.start,
            endTime: timeRange.end,
            title: dayEvent.title,
            facility: detail?.facility ?? "",
            address: detail?.address,
            notes: detail?.notes,
            mapUrl: detail?.mapUrl
        })
    }

    return events
}
