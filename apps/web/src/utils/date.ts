import { DateTime, Settings } from "luxon"

// Set default timezone to MST/Edmonton for now
// TODO: Make this configurable per user
Settings.defaultZone = "America/Edmonton"
Settings.defaultLocale = "en-US" // Use US locale to ensure AM/PM vs a.m./p.m.

export const DATE_FORMAT = DateTime.DATE_MED
export const DATETIME_FORMAT = DateTime.DATETIME_MED

export function formatDate(date: Date) {
    return DateTime.fromJSDate(date).toLocaleString(DATE_FORMAT)
}

export function formatDateTime(date: Date) {
    return DateTime.fromJSDate(date).toLocaleString(DATETIME_FORMAT)
}

// Helper for relative times (e.g. "2 hours ago")
export function formatRelativeTime(date: Date) {
    return DateTime.fromJSDate(date).toRelative()
}
