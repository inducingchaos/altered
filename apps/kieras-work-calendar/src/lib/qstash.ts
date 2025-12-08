import { Client } from "@upstash/qstash"
import { config } from "../config"
import { logger } from "./logger"

const qstashClient = config.qstash.token
    ? new Client({
          token: config.qstash.token
      })
    : null

let initializationPromise: Promise<void> | null = null
let isInitialized = false

async function findScheduleByDestination(url: string, cron: string): Promise<{ scheduleId: string; destination: string; cron: string } | null> {
    if (!qstashClient) return null

    try {
        const schedules = await qstashClient.schedules.list()
        const found = schedules.find(s => s.destination === url && s.cron === cron)
        if (!found) return null
        return {
            scheduleId: found.scheduleId,
            destination: found.destination,
            cron: found.cron
        }
    } catch {
        return null
    }
}

async function deleteSchedule(scheduleId: string): Promise<void> {
    if (!qstashClient) return

    try {
        await qstashClient.schedules.delete(scheduleId)
        logger.info("QStash schedule deleted", { scheduleId })
    } catch (error) {
        logger.error("Failed to delete QStash schedule", error)
        throw error
    }
}

async function createSchedule(url: string, cron: string): Promise<string> {
    if (!qstashClient) {
        logger.warn("QStash token not configured")
        throw new Error("QStash not configured")
    }

    try {
        const schedule = await qstashClient.schedules.create({
            destination: url,
            cron
        })

        logger.info("QStash schedule created", { scheduleId: schedule.scheduleId, url, cron })
        return schedule.scheduleId
    } catch (error) {
        logger.error("Failed to create QStash schedule", error)
        throw error
    }
}

async function publishOneTime(url: string): Promise<void> {
    if (!qstashClient) {
        logger.warn("QStash token not configured")
        return
    }

    await qstashClient.publishJSON({
        url,
        body: { action: "refresh" }
    })

    logger.info("QStash one-time job published", { url })
}

export async function scheduleRefresh(url: string, schedule?: string): Promise<void> {
    if (!qstashClient) return

    try {
        if (schedule) {
            await createSchedule(url, schedule)
        } else {
            await publishOneTime(url)
        }
    } catch (error) {
        logger.error("QStash scheduling failed", error)
        throw error
    }
}

export async function initializeQStashSchedule(baseUrl: string): Promise<void> {
    if (isInitialized) return

    if (initializationPromise) {
        await initializationPromise
        return
    }

    initializationPromise = (async () => {
        if (!qstashClient) {
            logger.warn("QStash not configured, skipping schedule initialization")
            isInitialized = true
            return
        }

        const refreshUrl = `${baseUrl}/api/refresh`
        const cronPattern = config.app.cronSchedule

        try {
            const existing = await findScheduleByDestination(refreshUrl, cronPattern)

            if (existing) {
                logger.info("QStash schedule already exists", {
                    scheduleId: existing.scheduleId,
                    url: refreshUrl,
                    cron: cronPattern
                })
                isInitialized = true
                return
            }

            await createSchedule(refreshUrl, cronPattern)
            logger.info("QStash schedule initialized", { refreshUrl, cronPattern })
            isInitialized = true
        } catch (error) {
            if (error instanceof Error && error.message.includes("already exists")) {
                logger.info("QStash schedule already exists (race condition handled)")
                isInitialized = true
                return
            }

            logger.error("QStash initialization failed", error)
            throw error
        }
    })()

    await initializationPromise
}
