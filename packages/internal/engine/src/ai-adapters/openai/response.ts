/**
 *
 */

import { OpenAICompletionResponse, OpenAIResponseMetadata } from "./types"

/**
 * Creates a non-streaming, OpenAI-compatible completion object.
 *
 * @remarks As part of our abstraction, we set the usage to zero. We can wire up actual usage from the AI SDK if desired.
 */
export function createOpenAICompletion(metadata: OpenAIResponseMetadata, content: string): OpenAICompletionResponse {
    return {
        ...metadata,

        object: "chat.completion",
        choices: [
            {
                index: 0,
                message: { role: "assistant", content },
                finish_reason: "stop"
            }
        ],

        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    }
}

/**
 * Converts a text stream to an OpenAI-compatible SSE format.
 */
export function createOpenAIStreamResponse(textStream: AsyncIterable<string>, metadata: OpenAIResponseMetadata): Response {
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
