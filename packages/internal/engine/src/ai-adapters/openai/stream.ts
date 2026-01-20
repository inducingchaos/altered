/**
 *
 */

import type {
    OpenAIMessage,
    OpenAITextContentPart,
    OpenAITextMessage
} from "@altered/data/shapes"

/**
 * Accumulates content from a text stream into a single string.
 */
export async function accumulateStreamContent(
    stream: AsyncIterable<string>
): Promise<string> {
    let content = ""

    for await (const chunk of stream) content += chunk

    return content
}

/**
 * Normalizes OpenAI-compatible messages (text or multimodal) to a text-only content format.
 *
 * @remarks Useful while multimodal input is not yet supported.
 */
export function normalizeOpenAIMessagesToText(
    messages: OpenAIMessage[]
): OpenAITextMessage[] {
    return messages.map(message => {
        const content =
            typeof message.content === "string"
                ? message.content
                : message.content
                      .filter(
                          (part): part is OpenAITextContentPart =>
                              part.type === "text"
                      )
                      .map(part => part.text)
                      .join("\n\n")

        return {
            ...message,

            content
        }
    })
}
