/**
 * Calendar ICS endpoint.
 */

import { generateICS } from "../lib/ics-generator"
import { fetchAndParseCalendar } from "../lib/calendar"

export async function handleCalendarICS() {
    const events = await fetchAndParseCalendar()
    const icsContent = generateICS(events)

    return new Response(icsContent, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": "attachment; filename=calendar.ics",
            "Cache-Control": "public, max-age=3600"
        }
    })
}
