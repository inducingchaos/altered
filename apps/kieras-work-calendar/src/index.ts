import { Elysia } from "elysia"
import { handleCalendarICS } from "./routes/calendar"
import { handleRefresh } from "./routes/refresh"
import { initializeQStashSchedule } from "./lib/qstash"

// Dynamic login is now implemented - session keys are fetched automatically on each calendar request
// This ensures we always have a fresh, valid session key without manual intervention

const app = new Elysia()
    .get("/", () => "Kiera's Work Calendar API")
    .get("/health", () => ({ status: "ok" }))
    .get("/calendar.ics", handleCalendarICS)
    .get("/api/refresh", handleRefresh)
    .post("/api/refresh", handleRefresh)

// Initialize QStash schedule on startup (only in production/serverless)
if (process.env.VERCEL_URL || process.env.QSTASH_TOKEN) {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL || "http://localhost:3000"
    initializeQStashSchedule(baseUrl).catch(error => {
        console.error("[QStash] Failed to initialize schedule:", error)
    })
}

// For local development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000
    app.listen(PORT)
    console.log(`Kiera's Work Calendar API running on port ${PORT}`)
}

// Export for Vercel serverless
export default app
