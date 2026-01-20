/**
 *
 */

import type { APIKey, GetApiKeyInput } from "@altered/data/shapes"
import { apiKeys, type Database } from "@altered-internal/data/store"
import { nanoid } from "nanoid"

type GetApiKeyProps = GetApiKeyInput & {
    context: {
        db: Database

        userId: string
    }
}

export async function getApiKey({
    query: { service },
    options,
    context: { db, userId }
}: GetApiKeyProps): Promise<{ apiKey: APIKey | null }> {
    const { createIfMissing = false } = options ?? {}

    const existingKey = await db.query.apiKeys.findFirst({
        where: {
            userId,
            service
        }
    })

    if (existingKey) return { apiKey: existingKey }
    if (!createIfMissing) return { apiKey: null }

    const keyValue = `altered_${service}_${nanoid(21)}`

    const [newKey] = await db
        .insert(apiKeys)
        .values({
            userId,
            service,
            value: keyValue
        })
        .returning()

    if (!newKey) throw new Error("Failed to create API key.")

    return { apiKey: newKey }
}
