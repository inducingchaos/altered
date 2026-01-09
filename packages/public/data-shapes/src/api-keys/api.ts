/**
 *
 */

import { type } from "arktype"

export const getApiKeyInputSchema = type({
    query: {
        service: "'ai-provider'"
    },
    "options?": {
        "createIfMissing?": "boolean"
    }
})

export type GetApiKeyInput = typeof getApiKeyInputSchema.infer

export const validateApiKeyInputSchema = type({
    query: {
        value: "string"
    }
})

export type ValidateApiKeyInput = typeof validateApiKeyInputSchema.infer
