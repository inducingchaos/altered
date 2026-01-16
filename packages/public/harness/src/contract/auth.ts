/**
 *
 */

import {
    apiKeySchema,
    getApiKeyInputSchema,
    validateApiKeyInputSchema
} from "@altered/data/shapes"
import { type } from "arktype"
import { contractFactory } from "./factory"

export const authContract = {
    apiKeys: {
        get: contractFactory
            .route({
                tags: ["internal"]
            })
            .input(getApiKeyInputSchema)
            .output(type({ apiKey: apiKeySchema.or("null") })),

        validate: contractFactory
            .route({
                tags: ["internal"]
            })
            .input(validateApiKeyInputSchema)
            .output(type({ userId: "string" }).or("null"))
    }
}
