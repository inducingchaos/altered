/**
 *
 */

import { readFile } from "fs/promises"
import { join } from "path"

async function validateICS() {
    const args = process.argv.slice(2).filter(arg => !arg.endsWith(".ts") && !arg.includes("tsx") && !arg.includes("validate-ics"))

    const filePathArg = args.find(arg => arg.includes("/") || arg.includes("\\") || arg.endsWith(".ics"))

    const filePath = filePathArg ?? join(process.cwd(), "calendar.ics")

    console.log(`[INFO] Validating ICS file: ${filePath}\n`)

    try {
        const content = await readFile(filePath, "utf-8")
        const lines = content.split("\n")

        const hasBegin = lines.some(line => line.startsWith("BEGIN:VCALENDAR"))
        const hasEnd = lines.some(line => line.startsWith("END:VCALENDAR"))
        const eventCount = lines.filter(line => line.startsWith("BEGIN:VEVENT")).length

        console.log("[INFO] ICS File Analysis:")
        console.log(`  File size: ${content.length} bytes`)
        console.log(`  Total lines: ${lines.length}`)
        console.log(`  Has BEGIN:VCALENDAR: ${hasBegin ? "[OK]" : "[MISSING]"}`)
        console.log(`  Has END:VCALENDAR: ${hasEnd ? "[OK]" : "[MISSING]"}`)
        console.log(`  Event count: ${eventCount}\n`)

        if (!hasBegin || !hasEnd) {
            console.log("[ERROR] Invalid ICS file - missing required markers")

            process.exit(1)
        }

        const events: Array<{
            summary?: string
            start?: string
            end?: string
            location?: string
        }> = []

        let currentEvent: Record<string, string> = {}
        let inEvent = false

        for (const line of lines) {
            if (line.startsWith("BEGIN:VEVENT")) {
                inEvent = true

                currentEvent = {}
            } else if (line.startsWith("END:VEVENT")) {
                if (inEvent) {
                    events.push({
                        summary: currentEvent.SUMMARY,
                        start: currentEvent.DTSTART,
                        end: currentEvent.DTEND,
                        location: currentEvent.LOCATION
                    })
                }

                inEvent = false
            } else if (inEvent) {
                const match = line.match(/^([A-Z-]+)(?:;.*)?:(.*)$/)

                if (match) {
                    const [, key, value] = match

                    currentEvent[key] = value
                }
            }
        }

        if (events.length > 0) {
            console.log("[INFO] Sample Events from ICS:")

            events.slice(0, 5).forEach((event, idx) => {
                console.log(`  ${idx + 1}. ${event.summary ?? "[No title]"}`)

                if (event.start) console.log(`     Start: ${event.start}`)
                if (event.end) console.log(`     End: ${event.end}`)
                if (event.location) console.log(`     Location: ${event.location}`)

                console.log()
            })

            if (events.length > 5) {
                console.log(`  ... and ${events.length - 5} more events\n`)
            }
        }

        console.log("[INFO] Validation Checks:")

        const hasProdId = lines.some(line => line.startsWith("PRODID:"))
        const hasVersion = lines.some(line => line.startsWith("VERSION:"))
        const hasCalScale = lines.some(line => line.startsWith("CALSCALE:"))

        console.log(`  PRODID: ${hasProdId ? "[OK]" : "[MISSING]"}`)
        console.log(`  VERSION: ${hasVersion ? "[OK]" : "[MISSING]"}`)
        console.log(`  CALSCALE: ${hasCalScale ? "[OK]" : "[MISSING] (optional)"}`)

        console.log("\n[INFO] ICS file appears valid")
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            console.error(`[ERROR] File not found: ${filePath}`)
            console.error("[INFO] Run 'pnpm execute diagnose --output-ics' first to generate the file")
        } else {
            console.error("[ERROR] Error reading ICS file:")
            console.error(error instanceof Error ? error.message : error)
        }

        process.exit(1)
    }
}

validateICS()
