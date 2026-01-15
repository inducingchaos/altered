/**
 *
 */

import { OpenAIErrorResponse } from "./types"

/**
 * Creates an OpenAI-compatible error response.
 *
 * @todo [P4] Improve and verify the error types and codes to fully match OpenAI's specification.
 */
export function createOpenAIErrorResponse({ message, code: errorCode, status = 500 }: { message: string; code?: string; status?: number }) {
    const type = status >= 500 ? "internal_server_error" : "invalid_request_error"

    const code = errorCode ?? type

    const body: OpenAIErrorResponse = {
        error: {
            message,
            type,
            code
        }
    }

    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}
