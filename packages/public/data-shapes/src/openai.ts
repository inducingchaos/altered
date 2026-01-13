/**
 *
 */

import { type } from "arktype"

/**
 * OpenAI-compatible message schema.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages
 */
export const openAIMessageSchema = type({
    role: '"system" | "user" | "assistant"',
    content: "string",
    "name?": "string"
})

export type OpenAIMessage = typeof openAIMessageSchema.infer
