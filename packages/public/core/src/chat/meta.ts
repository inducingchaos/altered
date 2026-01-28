/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { OpenAIMessage, OpenAITextMessage } from "./openai"

export type ChatMessage = OpenAIMessage

export type ChatTextMessage = OpenAITextMessage

/**
 * Streaming text chunk format for chat completions.
 *
 * @remarks Although AI suggested to keep this simplified format for all chat clients (including AI SDK, not just OpenAI-compatible clients), we may need to expand it to support the AI SDK and/or additional data.
 */
export type ChatStreamChunk = string
