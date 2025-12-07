import { Elysia } from "elysia"
import { handleCalendarICS } from "./routes/calendar"
import { handleRefresh } from "./routes/refresh"
import { initializeQStashSchedule } from "./lib/qstash"

// TODO: Implement dynamic login flow to automatically refresh session keys
// Session keys expire after ~30 minutes of inactivity, so we need to:
// 1. Intercept/login flow to get new session key
// 2. Store credentials securely
// 3. Auto-refresh before expiration

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
