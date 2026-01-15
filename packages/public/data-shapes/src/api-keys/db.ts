/**
 *
 */

import { type } from "arktype"

export const apiKeySchema = type({
    id: "string",
    service: "string",
    value: "string",
    lastUsedAt: "Date | null",
    createdAt: "Date",
    updatedAt: "Date"
})

export type APIKey = typeof apiKeySchema.infer
