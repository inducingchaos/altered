import { writeFile } from "fs/promises"
import { join } from "path"
import { fetchAndParseCalendar } from "../lib/calendar"
import { generateICS } from "../lib/ics-generator"
import { config } from "../config"

async function diagnose() {
    console.log("[INFO] Starting calendar diagnostics\n")

    const args = process.argv.slice(2)
    const outputJson = args.includes("--json")
    const outputIcs = args.includes("--output-ics")

    console.log("[INFO] Environment Variables:")
    console.log(`  ABIMM_USER_ID: ${config.abimm.userId}`)
    console.log(`  ABIMM_PIN: ${config.abimm.pin ? "[SET]" : "[MISSING]"}`)
    console.log(`  ABIMM_VENUE_ID: ${config.abimm.venueId}\n`)

    console.log("[INFO] Fetching calendar data...\n")

    try {
        console.log("[INFO] Fetching and parsing calendar...")
        const events = await fetchAndParseCalendar()

        console.log(`[INFO] Found ${events.length} events\n`)

        if (events.length > 0) {
            console.log("[INFO] Sample Events:")

            events.slice(0, 3).forEach((event, idx) => {
                console.log(`  ${idx + 1}. ${event.date} ${event.startTime}-${event.endTime}`)
                console.log(`     ${event.title} @ ${event.facility}`)
            })

            if (events.length > 3) {
                console.log(`  ... and ${events.length - 3} more events\n`)
            } else {
                console.log()
            }
        } else {
            console.warn("[WARN] No events found in calendar\n")
        }

        console.log("[INFO] Generating ICS file...")
        const icsContent = generateICS(events)

        console.log(`[INFO] Generated ${icsContent.length} bytes\n`)

        if (outputJson) {
            const jsonPath = join(process.cwd(), "calendar-events.json")

            await writeFile(jsonPath, JSON.stringify(events, null, 2), "utf-8")

            console.log(`[INFO] JSON output written to: ${jsonPath}\n`)
        }

        if (outputIcs) {
            const icsPath = join(process.cwd(), "calendar.ics")

            await writeFile(icsPath, icsContent, "utf-8")

            console.log(`[INFO] ICS file written to: ${icsPath}\n`)
        }

        console.log("[INFO] Validating ICS format...")
        const icsLines = icsContent.split("\n")
        const hasBegin = icsLines.some(line => line.startsWith("BEGIN:VCALENDAR"))
        const hasEnd = icsLines.some(line => line.startsWith("END:VCALENDAR"))
        const eventCount = icsLines.filter(line => line.startsWith("BEGIN:VEVENT")).length

        if (hasBegin && hasEnd) {
            console.log(`[INFO] Valid ICS format`)
            console.log(`[INFO] Found ${eventCount} calendar events in ICS`)

            if (eventCount !== events.length) {
                console.warn(`[WARN] Event count mismatch (parsed: ${events.length}, ICS: ${eventCount})`)
            }
        } else {
            console.error(`[ERROR] Invalid ICS format (missing BEGIN/END markers)`)
        }
        console.log()

        console.log("[INFO] Diagnostics completed successfully")
        console.log(`  Total events: ${events.length}`)
        console.log(`  ICS size: ${icsContent.length} bytes`)
        console.log(`  ICS events: ${eventCount}`)

        if (events.length === 0) {
            console.warn("\n[WARN] No events found. Possible causes:")
            console.warn("  - Session key expired")
            console.warn("  - No events scheduled for this month")
            console.warn("  - Parser issue")
        }

        if (!outputJson && !outputIcs) {
            console.log("\n[INFO] Use --json to output events as JSON")
            console.log("[INFO] Use --output-ics to save ICS file for validation")
        }
    } catch (error) {
        console.error("\n[ERROR] Diagnostics failed:")
        console.error(error instanceof Error ? error.message : error)

        if (error instanceof Error && error.stack) {
            console.error("\n[ERROR] Stack trace:")
            console.error(error.stack)
        }

        process.exit(1)
    }
}

diagnose()
