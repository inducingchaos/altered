/**
 *
 */

import { randomUUID } from "crypto"
import { OpenAIResponseMetadata } from "./types"

/**
 * Creates the standardized metadata fields for OpenAI-compatible responses.
 */
export function createOpenAIResponseMetadata(model: string): OpenAIResponseMetadata {
    return {
        id: `chatcmpl-${randomUUID()}`,
        created: Math.floor(Date.now() / 1000),
        model
    }
}
