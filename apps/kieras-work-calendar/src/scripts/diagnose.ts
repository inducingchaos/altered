/**
 * Diagnostic script to test calendar fetching and parsing.
 * Usage: pnpm execute diagnose [--json] [--output-ics]
 */

import { writeFile } from "fs/promises"
import { join } from "path"
import { fetchAndParseCalendar } from "../lib/calendar"
import { generateICS } from "../lib/ics-generator"

async function diagnose() {
    console.log("🔍 Starting calendar diagnostics...\n")

    // Parse command line arguments
    const args = process.argv.slice(2)
    const outputJson = args.includes("--json")
    const outputIcs = args.includes("--output-ics")

    // Check environment variables
    const userId = process.env.ABIMM_USER_ID
    const pin = process.env.ABIMM_PIN
    const venueId = process.env.ABIMM_VENUE_ID || "IDH"

    console.log("📋 Environment Variables:")
    console.log(`  ABIMM_USER_ID: ${userId || "❌ Missing"}`)
    console.log(`  ABIMM_PIN: ${pin ? "✅ Set" : "❌ Missing"}`)
    console.log(`  ABIMM_VENUE_ID: ${venueId}`)
    console.log()

    if (!userId || !pin) {
        console.error("❌ Missing required environment variables: ABIMM_USER_ID and ABIMM_PIN")
        console.error("💡 Note: We now use dynamic login - no need for ABIMM_SESSION_KEY!")
        process.exit(1)
    }

    console.log(`📅 Fetching calendar data...\n`)

    try {
        // Test fetching and parsing
        console.log("1️⃣ Fetching and parsing calendar...")
        const events = await fetchAndParseCalendar()
        console.log(`   ✅ Found ${events.length} events\n`)

        if (events.length > 0) {
            console.log("📆 Sample Events:")
            events.slice(0, 3).forEach((event, idx) => {
                console.log(`   ${idx + 1}. ${event.date} ${event.startTime}-${event.endTime}`)
                console.log(`      ${event.title} @ ${event.facility}`)
            })
            if (events.length > 3) {
                console.log(`   ... and ${events.length - 3} more events\n`)
            } else {
                console.log()
            }
        } else {
            console.log("   ⚠️  No events found in calendar\n")
        }

        // Test ICS generation
        console.log("2️⃣ Generating ICS file...")
        const icsContent = generateICS(events)
        console.log(`   ✅ Generated ${icsContent.length} bytes\n`)

        // Output JSON if requested
        if (outputJson) {
            const jsonPath = join(process.cwd(), "calendar-events.json")
            await writeFile(jsonPath, JSON.stringify(events, null, 2), "utf-8")
            console.log(`📄 JSON output written to: ${jsonPath}\n`)
        }

        // Output ICS file if requested
        if (outputIcs) {
            const icsPath = join(process.cwd(), "calendar.ics")
            await writeFile(icsPath, icsContent, "utf-8")
            console.log(`📅 ICS file written to: ${icsPath}`)
            console.log(`   You can open this file in your calendar app to validate!\n`)
        }

        // Validate ICS format
        console.log("3️⃣ Validating ICS format...")
        const icsLines = icsContent.split("\n")
        const hasBegin = icsLines.some(line => line.startsWith("BEGIN:VCALENDAR"))
        const hasEnd = icsLines.some(line => line.startsWith("END:VCALENDAR"))
        const eventCount = icsLines.filter(line => line.startsWith("BEGIN:VEVENT")).length

        if (hasBegin && hasEnd) {
            console.log(`   ✅ Valid ICS format`)
            console.log(`   ✅ Found ${eventCount} calendar events in ICS`)
            if (eventCount !== events.length) {
                console.log(`   ⚠️  Warning: Event count mismatch (parsed: ${events.length}, ICS: ${eventCount})`)
            }
        } else {
            console.log(`   ❌ Invalid ICS format (missing BEGIN/END markers)`)
        }
        console.log()

        // Summary
        console.log("✅ Diagnostics completed successfully!")
        console.log(`   Total events: ${events.length}`)
        console.log(`   ICS size: ${icsContent.length} bytes`)
        console.log(`   ICS events: ${eventCount}`)

        // Check for potential issues
        if (events.length === 0) {
            console.log("\n⚠️  Warning: No events found. This could indicate:")
            console.log("   - Session key expired")
            console.log("   - No events scheduled for this month")
            console.log("   - Parser issue")
        }

        // Show usage hints
        if (!outputJson && !outputIcs) {
            console.log("\n💡 Tip: Use --json to output events as JSON")
            console.log("💡 Tip: Use --output-ics to save ICS file for validation")
        }
    } catch (error) {
        console.error("\n❌ Diagnostics failed:")
        console.error(error instanceof Error ? error.message : error)
        if (error instanceof Error && error.stack) {
            console.error("\nStack trace:")
            console.error(error.stack)
        }
        process.exit(1)
    }
}

diagnose()
