/**
 *
 */

import { type } from "arktype"

export const openAITextContentPartSchema = type({
    type: '"text"',
    text: "string"
})

export type OpenAITextContentPart = typeof openAITextContentPartSchema.infer

export const openAIImageContentPartSchema = type({
    type: '"image_url"',

    image_url: {
        url: "string",
        "detail?": '"auto" | "low" | "high"'
    }
})

export type OpenAIImageContentPart = typeof openAIImageContentPartSchema.infer

export const openAIContentPartSchema = openAITextContentPartSchema.or(openAIImageContentPartSchema)

export type OpenAIContentPart = typeof openAIContentPartSchema.infer

export const openAIMessageContentSchema = openAIContentPartSchema.array().or("string")

export type OpenAIMessageContent = typeof openAIMessageContentSchema.infer

const openAIMessageBaseSchema = type({
    role: '"system" | "user" | "assistant"',
    "name?": "string"
})

export const openAITextMessageSchema = openAIMessageBaseSchema.merge({ content: "string" })

export type OpenAITextMessage = typeof openAITextMessageSchema.infer

export const openAIMultimodalMessageSchema = openAIMessageBaseSchema.merge({ content: openAIContentPartSchema.array() })

export type OpenAIMultimodalMessage = typeof openAIMultimodalMessageSchema.infer

export const openAIMessageSchema = openAITextMessageSchema.or(openAIMultimodalMessageSchema)

export type OpenAIMessage = typeof openAIMessageSchema.infer

/**
 * @todo [P3] Move to utils or the OpenAI provider module.
 */
export function normalizeOpenAIMessagesToText(messages: OpenAIMessage[]): OpenAITextMessage[] {
    return messages.map(message => {
        const content =
            typeof message.content === "string"
                ? message.content
                : message.content
                      .filter((part): part is OpenAITextContentPart => part.type === "text")
                      .map(part => part.text)
                      .join("\n\n")

        return {
            ...message,

            content
        }
    })
}
