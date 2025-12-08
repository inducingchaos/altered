/**
 * Logging utility with configurable verbosity.
 */

import { DateTime } from "luxon"
import { config } from "../config"

function log(level: string, message: string, ...args: unknown[]): void {
    if (!config.app.enableLogging) return

    const timestamp = DateTime.now().setZone(config.app.timezone).toISO()

    console.log(`[${timestamp}] [${level}] ${message}`, ...args)
}

export const logger = {
    info: (message: string, ...args: unknown[]) => log("INFO", message, ...args),
    error: (message: string, ...args: unknown[]) => log("ERROR", message, ...args),
    warn: (message: string, ...args: unknown[]) => log("WARN", message, ...args)
}
