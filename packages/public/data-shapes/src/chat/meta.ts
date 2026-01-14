/**
 *
 */

import { type } from "arktype"
import { OpenAIMessage, OpenAITextMessage } from "./openai"

export type ChatMessage = OpenAIMessage

export type ChatTextMessage = OpenAITextMessage

/**
 * Streaming text chunk format for chat completions.
 *
 * @remarks Although AI suggested to keep this simplified format for all chat clients (including AI SDK, not just OpenAI-compatible clients), we may need to expand it to support the AI SDK and/or additional data.
 */
export const chatStreamChunkSchema = type("string")

export type ChatStreamChunk = typeof chatStreamChunkSchema.infer
