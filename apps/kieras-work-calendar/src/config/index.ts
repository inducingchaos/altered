/**
 * Application configuration and environment validation.
 */

function requireEnv(key: string): string {
    const value = process.env[key]
    if (!value) throw new Error(`Missing required environment variable: ${key}`)

    return value
}

function optionalEnv(key: string, defaultValue: string): string {
    return process.env[key] ?? defaultValue
}

export const config = {
    abimm: {
        userId: requireEnv("ABIMM_USER_ID"),
        pin: requireEnv("ABIMM_PIN"),
        venueId: optionalEnv("ABIMM_VENUE_ID", "IDH")
    },
    qstash: {
        url: optionalEnv("QSTASH_URL", ""),
        token: optionalEnv("QSTASH_TOKEN", ""),
        currentSigningKey: optionalEnv("QSTASH_CURRENT_SIGNING_KEY", ""),
        nextSigningKey: optionalEnv("QSTASH_NEXT_SIGNING_KEY", "")
    },
    internal: {
        secret: requireEnv("INTERNAL_SECRET")
    },
    app: {
        enableLogging: process.env.ENABLE_LOGGING === "true",
        cronSchedule: optionalEnv("CRON_SCHEDULE", "0 */8 * * *"),
        monthsToFetch: parseInt(optionalEnv("MONTHS_TO_FETCH", "3"), 10),
        timezone: optionalEnv("TIMEZONE", "America/Edmonton"),
        calendarName: optionalEnv("CALENDAR_NAME", "ICE District Authentics Work Schedule")
    }
}
