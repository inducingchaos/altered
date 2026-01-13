/**
 * @todo [P1] We should/could figure out a way to move this endpoint to the oRPC router.
 */

import { OpenAIMessage, OpenrouterModelID } from "@altered/data/shapes"
import { ORPCError } from "@orpc/server"
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

        if (invalidMessages) return createOpenAIErrorResponse({ message: "Invalid messages format", code: "invalid_messages", status: 400 })

        //  REMARKS: We strip out keys that don't exist in the body. Is this necessary, or can we just avoid initializing the keys in the first place?

        const strippedInput = Object.fromEntries(Object.entries(rawInput).filter(([, value]) => value !== undefined)) as OpenAICompatibleCompletionInput

        const resolvedModelId = resolveModelId(strippedInput.model)

        const result = await api.ai.generate.completions.openAICompatible.call({ ...strippedInput, model: resolvedModelId })

        if (result.error) {
            const error = result.error

            //  REMARKS: We could just make `createOpenAIErrorResponse` accept an error response with optional keys and handle internally.

            if (error instanceof ORPCError) return createOpenAIErrorResponse({ ...error })

            return createOpenAIErrorResponse({ message: error.message, code: "internal_error", status: 500 })
        }

        const resultIterator = result.data
        const shouldStream = strippedInput.stream ?? true

        //  REMARKS: Are these all standard keys and value formats? Can we move any more to this helper, or move to a function to create the options dynamically?

        const responseValues = {
            id: `chatcmpl-${randomUUID()}`,
            created: Math.floor(Date.now() / 1000),
            model: resolvedModelId
        }

        if (!shouldStream) {
            //  REMARKS: What does this do, is it needed?

            let completion = ""
            for await (const event of resultIterator) completion += event.content

            return new Response(
                JSON.stringify({
                    ...responseValues,

                    object: "chat.completion",
                    choices: [
                        //  REMARKS: Can we convert to a preset that can be extended later?

                        {
                            index: 0,
                            message: {
                                role: "assistant",
                                content: completion
                            },
                            finish_reason: "stop"
                        }
                    ],
                    //  REMARKS: Should this be provided on the streaming version too, and how should we derive it? Should it be a calculation function or something sent from the server?

                    usage: {
                        prompt_tokens: 0,
                        completion_tokens: 0,
                        total_tokens: 0
                    }
                }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        //  REMARKS: Is this needed to convert to a different format? Can we functionize if so?

        const textStream = (async function* () {
            for await (const event of resultIterator) {
                if (event.content && !event.isComplete) {
                    yield event.content
                }
            }
        })()

        //  REMARKS: Is this new streaming controller needed, or can we leverage the existing layers?

        return createOpenAIStreamResponse(textStream, responseValues)
    } catch (error) {
        console.error("OpenAI compatible completions API error:", error)

        return createOpenAIErrorResponse({ message: error instanceof Error ? error.message : "An unexpected error occurred.", code: "internal_server_error", status: 500 })
    }
}

/**
 * @todo [P4] Is this the required format? What are all of the options (can we create proper types and utils for this)?
 */
export const createOpenAIErrorResponse = ({ message, code, status }: { message: string; code: string; status: number }) =>
    new Response(
        JSON.stringify({
            error: {
                message,
                type: status >= 500 ? "internal_server_error" : "invalid_request_error",
                code
            }
        }),

        { status, headers: { "Content-Type": "application/json" } }
    )

/**
 * @remarks Converts an AI SDK text stream to OpenAI-compatible SSE format.
 */
export function createOpenAIStreamResponse(textStream: AsyncIterable<string>, responseValues: { id: string; created: number; model: string }) {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()

            const encode = (data: unknown) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`)

            try {
                for await (const chunk of textStream)
                    controller.enqueue(
                        encode({
                            ...responseValues,

                            object: "chat.completion.chunk",
                            choices: [{ index: 0, delta: { content: chunk }, finish_reason: null }]
                        })
                    )

                controller.enqueue(
                    encode({
                        ...responseValues,

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
