/**
 *
 */

import { apiKeySchema } from "@altered/data/shapes"

export const internalApiKeySchema = apiKeySchema.merge({
    userId: "string"
})

export type InternalAPIKey = typeof internalApiKeySchema.infer
