/**
 *
 */

import { application } from "@altered-internal/config"
import { OpenAIMessage, OpenrouterModelID } from "@altered/data/shapes"
import { arktypeToAiJsonSchema } from "@altered/utils"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText, Output } from "ai"
import { type } from "arktype"

export type GenerateChatTitleOptions = {
    input: {
        messages: OpenAIMessage[]
        temperature?: number
        maxTokens?: number
    }

    options: {
        /**
         * Used to select an internal model.
         */
        modelId?: OpenrouterModelID
    }
}

export type GenerateChatTitleDefaults = Omit<GenerateChatTitleOptions["input"], "messages"> & GenerateChatTitleOptions["options"]

/**
 * @todo [P2] Research, adjust, move.
 */
export const generateChatTitleDefaults = {
    temperature: 0.7,
    maxTokens: 256,
    modelId: "google/gemini-2.5-flash-lite"
} satisfies GenerateChatTitleDefaults

const chatTitleSchema = type({
    language: type("string").describe("The language of the title."),
    title: type("string").describe("A concise, descriptive title for the chat conversation.")
})

export type ChatTitleResult = typeof chatTitleSchema.infer

/**
 * @todo [P3] Allow parsing of other message formats, such as that of the AI SDK.
 */
export function isChatTitleGenerationRequest(messages: OpenAIMessage[]): boolean {
    if (!messages.length) return false

    const messagePatterns = [/generate.*(?:a|an|the)?\s*(?:concise|short|brief)?\s*(?:chat|conversation)?\s*title/i, /create.*(?:a|an|the)?\s*(?:chat|conversation)?\s*title/i, /suggest.*(?:a|an|the)?\s*(?:chat|conversation)?\s*title/i, /title.*(?:for|of|this|the)?\s*(?:chat|conversation)/i, /summarize.*(?:as|into)?\s*(?:a|an|the)?\s*title/i]

    return messages.some(message => messagePatterns.some(pattern => pattern.test(message.content)))
}

/**
 * Generates structured data for a chat title using ALTERED's tooling.
 *
 * @returns A generator for unified consumption.
 *
 * @remarks This is no longer used for OpenAI-compatible endpoints (as we handle title JSON requests just like any other request). We should refactor this for use in our own trusted chat clients.
 *
 * @todo [P3] Consider consolidating into the `generateChatCompletions` function, or an abstraction layer above it.
 */
export async function* generateChatTitle({ input, options }: GenerateChatTitleOptions) {
    /**
     * @todo [P3] Move to a shared providers layer.
     */
    const openrouter = createOpenRouter({ apiKey: application.env.providers.openrouter.secret })

    /**
     * @todo [P3] Figure out if this should include our main system prompt.
     */
    const systemPrompt = "Generate a concise, descriptive title for the chat conversation. Return only a valid JSON object matching the schema."

    const augmentedMessages: OpenAIMessage[] = [{ role: "system", content: systemPrompt }, ...input.messages]

    const model = openrouter.chat(options.modelId ?? generateChatTitleDefaults.modelId)
    const temperature = input.temperature ?? generateChatTitleDefaults.temperature
    const maxOutputTokens = input.maxTokens ?? generateChatTitleDefaults.maxTokens

    const { output } = await generateText({
        model,
        messages: augmentedMessages,
        temperature,
        maxOutputTokens,
        output: Output.object({
            name: "Chat Title",
            description: "A title for the chat conversation.",
            schema: arktypeToAiJsonSchema(chatTitleSchema)
        })
    })

    yield output
}
