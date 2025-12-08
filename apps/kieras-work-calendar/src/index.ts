/**
 *
 */

import { Elysia } from "elysia"
import { handleCalendarICS } from "./routes/calendar"
import { handleRefresh } from "./routes/refresh"
import { logger } from "./lib/logger"

const app = new Elysia()
    .onError(({ code, error, set }) => {
        const errorMessage = error instanceof Error ? error.message : String(error)

        logger.error("Request error", { code, error: errorMessage })

        if (code === "NOT_FOUND") {
            set.status = 404

            return { error: "Not found" }
        }

        set.status = 500

        return {
            error: "Internal server error",
            message: errorMessage
        }
    })
    .get("/", () => "Kiera's Work Calendar API")
    .get("/health", () => ({ status: "ok" }))
    .get("/calendar.ics", handleCalendarICS)
    .get("/api/refresh", handleRefresh)
    .post("/api/refresh", handleRefresh)

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT ?? 3000
    app.listen(PORT)
    logger.info("Server started", { port: PORT })
}

export default app
