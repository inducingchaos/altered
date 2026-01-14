/**
 *
 */

/**
 * Standard metadata fields for OpenAI-compatible responses.
 */
export type OpenAIResponseMetadata = {
    id: string
    created: number
    model: string
}

/**
 * Non-streaming completion response.
 */
export type OpenAICompletionResponse = OpenAIResponseMetadata & {
    object: "chat.completion"
    choices: {
        index: number
        message: {
            role: "assistant"
            content: string
        }
        finish_reason: "stop"
    }[]

    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

/**
 * Streaming completion chunk.
 */
export type OpenAIStreamChunk = OpenAIResponseMetadata & {
    object: "chat.completion.chunk"
    choices: {
        index: number
        delta: { content?: string }
        finish_reason: "stop" | null
    }[]
}

/**
 * OpenAI-compatible error response.
 */
export type OpenAIErrorResponse = {
    error: {
        message: string
        type: "invalid_request_error" | "internal_server_error"
        code: string
    }
}
