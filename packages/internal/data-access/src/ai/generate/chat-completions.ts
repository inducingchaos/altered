/**
 *
 */

import { application } from "@altered-internal/config"
import { Database } from "@altered-internal/data/store"
import { OpenAIMessage, OpenrouterModelID } from "@altered/data/shapes"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText, streamText } from "ai"
import { buildSystemPrompt } from "./build-system-prompt"

export type GenerateChatCompletionOptions = {
    input: {
        messages: OpenAIMessage[]
        temperature?: number
        maxTokens?: number
        stream?: boolean
    }

    options: {
        /**
         * Used to select an internal model.
         */
        modelId?: OpenrouterModelID
    }

    context: {
        db: Database
        brainId: string
    }
}

export type GenerateChatCompletionDefaults = Omit<GenerateChatCompletionOptions["input"], "messages"> & GenerateChatCompletionOptions["options"]

/**
 * @todo [P2] Research, adjust, move.
 */
export const generateChatCompletionsDefaults = {
    temperature: 0.7,
    maxTokens: 4096,
    modelId: "google/gemini-2.5-flash-lite"
} satisfies GenerateChatCompletionDefaults

/**
 * Generates and optionally streams AI chat completions using ALTERED's tooling.
 *
 * @todo [P2] Disambiguate between OpenAI-specific input formats and those provided by the AI SDK.
 *
 * @remarks Always returns a generator for unified consumption.
 */
export async function* generateChatCompletion({ input, options, context }: GenerateChatCompletionOptions) {
    const openrouter = createOpenRouter({ apiKey: application.env.providers.openrouter.secret })

    const systemPrompt = await buildSystemPrompt({ context })

    const augmentedMessages: OpenAIMessage[] = [{ role: "system", content: systemPrompt }, ...input.messages]

    const model = openrouter.chat(options.modelId ?? generateChatCompletionsDefaults.modelId)
    const temperature = input.temperature ?? generateChatCompletionsDefaults.temperature
    const maxOutputTokens = input.maxTokens ?? generateChatCompletionsDefaults.maxTokens

    const shouldStream = input.stream !== false

    if (shouldStream) {
        const { textStream } = streamText({
            model,
            messages: augmentedMessages,
            temperature,
            maxOutputTokens
        })

        for await (const chunk of textStream) yield chunk
    } else {
        const { text } = await generateText({
            model,
            messages: augmentedMessages,
            temperature,
            maxOutputTokens
        })

        yield text
    }
}
