/**
 * @todo [P1] We should/could figure out a way to move this endpoint to the oRPC router.
 */

import { normalizeOpenAIMessagesToText, OpenAIMessage, OpenrouterModelID } from "@altered/data/shapes"
import { randomUUID } from "crypto"
import { NextRequest } from "next/server"
import { api } from "~/lib/infra/rpc"

/**
 * @todo [P3] Decide if we should return our branded model ID as the result, or return the input model ID to match OpenAI's specification (to avoid creating mismatches on the client).
 */
const modelIds = ["kai-v1"] as const

type ModelID = (typeof modelIds)[number]

/**
 * @remarks This will most likely be refactored to route external/branded model IDs to the appropriate endpoints and/or produce the relevant handler parameters - but for now, it just converts the input model ID to an internal model ID.
 */
export function resolveModelId(model?: string): OpenrouterModelID {
    if (model && !modelIds.includes(model as ModelID)) throw new Error(`Invalid model ID: ${model}`)

    return "google/gemini-2.5-flash-lite"
}

export async function POST(request: NextRequest) {
    try {
        //  REMARKS: We're not authenticating here, since ideally this will be moved to our oRPC router. We also do an auth check before fulfilling the API calls.

        /**
         * @todo [P3] Replace references to this type with a refactored version.
         */
        type OpenAICompatibleCompletionInput = {
            messages: OpenAIMessage[]
            model?: string
            temperature?: number
            max_tokens?: number
            stream?: boolean
        }

        const rawInput = (await request.json()) as OpenAICompatibleCompletionInput

        //  REMARKS: These runtime checks won't be necessary with our oRPC validation, but we may want to consider integrating the OpenAI-compatible error responses into our router.

        const invalidMessages = !rawInput.messages || !Array.isArray(rawInput.messages)

        if (invalidMessages) return createOpenAIErrorResponse({ message: "Invalid messages format", code: "invalid_messages" })

        const normalizedMessages = normalizeOpenAIMessagesToText(rawInput.messages)
        const resolvedModelId = resolveModelId(rawInput.model)

        const result = await api.ai.generate.completions.openAICompatible.call({
            ...rawInput,

            messages: normalizedMessages,
            model: resolvedModelId
        })

        if (result.error) return createOpenAIErrorResponse(result.error)

        const resultIterator = result.data
        const shouldStream = rawInput.stream ?? false
        const responseMetadata = createOpenAIResponseMetadata(resolvedModelId)

        if (!shouldStream) {
            const completionContent = await accumulateStreamContent(resultIterator)

            const completion = createOpenAICompletion(responseMetadata, completionContent)

            return new Response(JSON.stringify(completion), { headers: { "Content-Type": "application/json" } })
        }

        const textStream = extractTextStream(resultIterator)

        return createOpenAIStreamResponse(textStream, responseMetadata)
    } catch (error) {
        console.error("OpenAI compatible completions API error:", error)

        return createOpenAIErrorResponse({ message: error instanceof Error ? error.message : "An unexpected error occurred.", code: "internal_server_error", status: 500 })
    }
}

type OpenAIResponseMetadata = { id: string; created: number; model: string }

/**
 * Creates the standardized metadata fields for OpenAI-compatible responses.
 */
function createOpenAIResponseMetadata(model: string): OpenAIResponseMetadata {
    return {
        id: `chatcmpl-${randomUUID()}`,
        created: Math.floor(Date.now() / 1000),
        model
    }
}

/**
 * Creates a non-streaming, OpenAI-compatible completion object.
 *
 * @remarks As part of our abstraction, we set the usage to zero. We can wire up actual usage from the AI SDK if desired.
 */
function createOpenAICompletion(metadata: OpenAIResponseMetadata, content: string) {
    return {
        ...metadata,

        object: "chat.completion" as const,
        choices: [
            {
                index: 0,
                message: { role: "assistant" as const, content },
                finish_reason: "stop" as const
            }
        ],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    }
}

/**
 * Creates an OpenAI-compatible error response.
 *
 * @todo [P4] Could improve the error types and codes.
 */
function createOpenAIErrorResponse({ message, code, status = 500 }: { message: string; code?: string; status?: number }) {
    return new Response(
        JSON.stringify({
            error: {
                message,
                type: status >= 500 ? "internal_server_error" : "invalid_request_error",
                code: code ?? (status >= 500 ? "internal_server_error" : "invalid_request_error")
            }
        }),

        { status, headers: { "Content-Type": "application/json" } }
    )
}

/**
 * Converts a text stream to OpenAI-compatible SSE format.
 */
function createOpenAIStreamResponse(textStream: AsyncIterable<string>, metadata: OpenAIResponseMetadata) {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()

            const encode = (data: unknown) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`)

            try {
                for await (const chunk of textStream)
                    controller.enqueue(
                        encode({
                            ...metadata,

                            object: "chat.completion.chunk",
                            choices: [{ index: 0, delta: { content: chunk }, finish_reason: null }]
                        })
                    )

                controller.enqueue(
                    encode({
                        ...metadata,

                        object: "chat.completion.chunk",
                        choices: [{ index: 0, delta: {}, finish_reason: "stop" }]
                    })
                )

                controller.enqueue(encoder.encode("data: [DONE]\n\n"))

                controller.close()
            } catch (error) {
                controller.error(error)
            }
        }
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
        }
    })
}

type IteratorEvent = { content: string; isComplete?: boolean }

/**
 * Extracts text content from the oRPC iterator format.
 *
 * @todo [P4] Evaluate if we really need this. The input is of the type:
 *
 * ```typescript
 * const resultIterator: AsyncIteratorClass<{
 *     content: string
 *     finishReason?: string | undefined
 *     isComplete?: boolean | undefined
 * }, unknown, void>
 * ```
 *
 * Or at the least, are we able to minify or remove the internal anonymous generator function that wraps the conversion?
 */
function extractTextStream(iterator: AsyncIterable<IteratorEvent>): AsyncIterable<string> {
    return (async function* () {
        for await (const event of iterator) {
            if (event.content && !event.isComplete) {
                yield event.content
            }
        }
    })()
}

/**
 * Accumulates content from the iterator into a single string for non-streaming responses.
 */
async function accumulateStreamContent(iterator: AsyncIterable<IteratorEvent>): Promise<string> {
    let content = ""

    for await (const event of iterator) content += event.content

    return content
}
