/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type GetApiKeyInput = {
    query: {
        service: "ai-provider"
    }
    options?: {
        createIfMissing?: boolean
    }
}

export type ValidateApiKeyInput = {
    query: {
        value: string
    }
}
