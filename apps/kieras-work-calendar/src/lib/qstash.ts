/**
 * QStash integration for scheduled calendar refreshes
 * Alternative to Vercel cron - provides more flexibility and reliability
 */

import { Client } from "@upstash/qstash"

const qstashClient = process.env.QSTASH_TOKEN
    ? new Client({
          token: process.env.QSTASH_TOKEN
      })
    : null

/**
 * Schedule a calendar refresh via QStash
 */
export async function scheduleRefresh(url: string, schedule?: string): Promise<void> {
    if (!qstashClient) {
        console.warn("QStash token not configured, skipping scheduled refresh")
        return
    }

    try {
        if (schedule) {
            // Schedule recurring job (e.g., "0 0 * * *" for daily at midnight)
            await qstashClient.schedules.create({
                destination: url,
                cron: schedule
            })
            console.log(`[QStash] Scheduled recurring refresh: ${schedule}`)
        } else {
            // One-time job
            await qstashClient.publishJSON({
                url,
                body: { action: "refresh" }
            })
            console.log(`[QStash] Scheduled one-time refresh`)
        }
    } catch (error) {
        console.error(`[QStash] Failed to schedule refresh:`, error)
        throw error
    }
}

/**
 * Initialize QStash schedule (call this on app startup)
 * Only schedules if not already scheduled to avoid duplicates
 */
export async function initializeQStashSchedule(baseUrl: string): Promise<void> {
    if (!qstashClient) {
        console.warn("QStash token not configured, skipping schedule initialization")
        return
    }

    const refreshUrl = `${baseUrl}/api/refresh`

    try {
        // Check if schedule already exists
        const schedules = await qstashClient.schedules.list()
        const cronPattern = "0 */8 * * *" // Every 8 hours at minute 0
        const existingSchedule = schedules.find(s => s.destination === refreshUrl && s.cron === cronPattern)

        if (existingSchedule) {
            console.log(`[QStash] Schedule already exists, skipping initialization`)
            return
        }

        // Schedule refresh every 8 hours
        await scheduleRefresh(refreshUrl, cronPattern)
        console.log(`[QStash] Initialized 8-hour schedule for ${refreshUrl}`)
    } catch (error) {
        console.error(`[QStash] Failed to initialize schedule:`, error)
        // Don't throw - allow app to continue even if scheduling fails
    }
}
