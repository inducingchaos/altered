/**
 * Parses calendar events from HTML response
 */

export interface CalendarEvent {
    id: string
    date: string // YYYY-MM-DD
    startTime: string // HH:mm
    endTime: string // HH:mm
    title: string
    facility: string
    address?: string
    notes?: string
    mapUrl?: string
}

/**
 * Extracts calendar events from the HTML calendar page
 */
export function parseCalendarHtml(html: string): CalendarEvent[] {
    const events: CalendarEvent[] = []

    // Extract event details from the hidden form div
    // Events are stored in divs with IDs like "1evt", "1fac", "1addr", "1note", "1map"
    const eventIdPattern = /<div id="(\d+)evt">([^<]+)<\/div>/g
    const facilityPattern = /<div id="(\d+)fac">([^<]+)<\/div>/g
    const addressPattern = /<div id="(\d+)addr">([^<]+(?:<br\/>[^<]*)*)<\/div>/g
    const notePattern = /<div id="(\d+)note">([^<]*)<\/div>/g
    const mapPattern = /<div id="(\d+)map">([^<]+)<\/div>/g

    // Extract calendar month from the page
    const monthMatch = html.match(/<span class="MonthTitle">([^<]+)<\/span>/)
    const monthTitle = monthMatch ? monthMatch[1] : null

    // Parse month title (e.g., "December 2025")
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1

    if (monthTitle) {
        const monthMatch = monthTitle.match(/(\w+)\s+(\d{4})/)
        if (monthMatch) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const monthName = monthMatch[1]
            month = monthNames.indexOf(monthName) + 1
            year = parseInt(monthMatch[2], 10)
        }
    }

    // Extract events from calendar table
    // Format: <a href="javascript:showDetails('1')" title="Click to view details"> 9:45 am -  6:15 pm  (FLS)</a><br>&nbsp;&nbsp;FLAGSHIP DAILY WORK<br>
    // We need to extract: day number, event ID from showDetails, time range, and title
    const dayDetailsPattern = /<td class="calendar_day_box">\s*(\d+)\s*<div class="day_details"><a[^>]*showDetails\(['"](\d+)['"]\)[^>]*>([^<]+)<\/a><br[^>]*>&nbsp;&nbsp;([^<]+)<br>/g

    let dayMatch
    const dayEvents: Array<{ day: number; eventId: string; time: string; title: string }> = []

    while ((dayMatch = dayDetailsPattern.exec(html)) !== null) {
        const day = parseInt(dayMatch[1], 10)
        const eventId = dayMatch[2]
        const timeRange = dayMatch[3].trim()
        const title = dayMatch[4].trim()

        dayEvents.push({ day, eventId, time: timeRange, title })
    }

    // Extract event details from hidden divs
    const eventDetails: Map<
        string,
        {
            event: string
            facility: string
            address?: string
            notes?: string
            mapUrl?: string
        }
    > = new Map()

    let evtMatch
    while ((evtMatch = eventIdPattern.exec(html)) !== null) {
        const id = evtMatch[1]
        const eventName = evtMatch[2]

        if (!eventDetails.has(id)) {
            eventDetails.set(id, { event: eventName, facility: "" })
        } else {
            eventDetails.get(id)!.event = eventName
        }
    }

    let facMatch
    while ((facMatch = facilityPattern.exec(html)) !== null) {
        const id = facMatch[1]
        const facility = facMatch[2]

        if (!eventDetails.has(id)) {
            eventDetails.set(id, { event: "", facility })
        } else {
            eventDetails.get(id)!.facility = facility
        }
    }

    let addrMatch
    while ((addrMatch = addressPattern.exec(html)) !== null) {
        const id = addrMatch[1]
        const address = addrMatch[2]
            .replace(/<br\/>/gi, ", ")
            .replace(/\s+/g, " ")
            .trim()

        if (!eventDetails.has(id)) {
            eventDetails.set(id, { event: "", facility: "", address })
        } else {
            eventDetails.get(id)!.address = address
        }
    }

    let noteMatch
    while ((noteMatch = notePattern.exec(html)) !== null) {
        const id = noteMatch[1]
        const notes = noteMatch[2]

        if (notes && notes.trim()) {
            if (!eventDetails.has(id)) {
                eventDetails.set(id, { event: "", facility: "", notes })
            } else {
                eventDetails.get(id)!.notes = notes
            }
        }
    }

    let mapMatch
    while ((mapMatch = mapPattern.exec(html)) !== null) {
        const id = mapMatch[1]
        const mapUrl = mapMatch[2]

        if (!eventDetails.has(id)) {
            eventDetails.set(id, { event: "", facility: "", mapUrl })
        } else {
            eventDetails.get(id)!.mapUrl = mapUrl
        }
    }

    // Combine day events with event details using the event ID
    for (const dayEvent of dayEvents) {
        // Find matching event detail by event ID
        const matchingDetail = eventDetails.get(dayEvent.eventId)

        // Parse time range (e.g., "9:45 am -  6:15 pm")
        const timeMatch = dayEvent.time.match(/(\d{1,2}):(\d{2})\s*(am|pm)\s*-\s*(\d{1,2}):(\d{2})\s*(am|pm)/i)

        if (!timeMatch) continue

        const startHour = parseInt(timeMatch[1], 10)
        const startMinute = parseInt(timeMatch[2], 10)
        const startPeriod = timeMatch[3].toLowerCase()
        const endHour = parseInt(timeMatch[4], 10)
        const endMinute = parseInt(timeMatch[5], 10)
        const endPeriod = timeMatch[6].toLowerCase()

        const startHour24 = startPeriod === "pm" && startHour !== 12 ? startHour + 12 : startPeriod === "am" && startHour === 12 ? 0 : startHour

        const endHour24 = endPeriod === "pm" && endHour !== 12 ? endHour + 12 : endPeriod === "am" && endHour === 12 ? 0 : endHour

        const date = new Date(year, month - 1, dayEvent.day)
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(dayEvent.day).padStart(2, "0")}`

        events.push({
            id: `${dateStr}-${dayEvent.eventId}-${dayEvent.title}`,
            date: dateStr,
            startTime: `${String(startHour24).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
            endTime: `${String(endHour24).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
            title: dayEvent.title,
            facility: matchingDetail?.facility || "",
            address: matchingDetail?.address,
            notes: matchingDetail?.notes,
            mapUrl: matchingDetail?.mapUrl
        })
    }

    return events
}
