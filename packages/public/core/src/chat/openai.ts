/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type OpenAITextContentPart = {
    type: "text"
    text: string
}

export type OpenAIImageContentPart = {
    type: "image_url"
    image_url: {
        url: string
        detail?: "auto" | "low" | "high"
    }
}

export type OpenAIContentPart = OpenAITextContentPart | OpenAIImageContentPart

export type OpenAIMessageContent = OpenAIContentPart[] | string

type OpenAIMessageBase = {
    role: "system" | "user" | "assistant"
    name?: string
}

export type OpenAITextMessage = OpenAIMessageBase & {
    content: string
}

export type OpenAIMultimodalMessage = OpenAIMessageBase & {
    content: OpenAIContentPart[]
}

export type OpenAIMessage = OpenAITextMessage | OpenAIMultimodalMessage
