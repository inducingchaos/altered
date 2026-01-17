/**
 * @todo [P1] We should/could figure out a way to move this endpoint to the oRPC router.
 */

import {
    type ModelID,
    modelIds,
    type OpenAIMessage,
    type OpenrouterModelID
} from "@altered/data/shapes"
import {
    accumulateStreamContent,
    createOpenAICompletion,
    createOpenAIErrorResponse,
    createOpenAIResponseMetadata,
    createOpenAIStreamResponse,
    normalizeOpenAIMessagesToText
} from "@altered-internal/engine"
import type { NextRequest } from "next/server"
import { api } from "~/lib/infra/rpc"

/**
 * @remarks This will most likely be refactored to route external/branded model IDs to the appropriate endpoints and/or produce the relevant handler parameters - but for now, it just converts the input model ID to an internal model ID.
 *
 * @todo [P3] Decide if we should return our branded model ID as the result, or return the input model ID to match OpenAI's specification (to avoid creating mismatches on the client).
 */
export function resolveModelId(model?: string): OpenrouterModelID {
    if (model && !modelIds.includes(model as ModelID))
        throw new Error(`Invalid model ID: ${model}`)

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

        const rawInput =
            (await request.json()) as OpenAICompatibleCompletionInput

        //  REMARKS: These runtime checks won't be necessary with our oRPC validation, but we may want to consider integrating the OpenAI-compatible error responses into our router.

        const invalidMessages = !(
            rawInput.messages && Array.isArray(rawInput.messages)
        )

        if (invalidMessages)
            return createOpenAIErrorResponse({
                message: "Invalid messages format",
                code: "invalid_messages"
            })

        const normalizedMessages = normalizeOpenAIMessagesToText(
            rawInput.messages
        )
        const resolvedModelId = resolveModelId(rawInput.model)

        const result = await api.ai.generate.completions.openAICompatible.call({
            ...rawInput,

            messages: normalizedMessages,
            model: resolvedModelId
        })

        if (result.error) return createOpenAIErrorResponse(result.error)

        const resultStream = result.data

        const shouldStreamResult = rawInput.stream ?? false
        const responseMetadata = createOpenAIResponseMetadata(resolvedModelId)

        if (!shouldStreamResult) {
            const completionContent =
                await accumulateStreamContent(resultStream)

            const completion = createOpenAICompletion(
                responseMetadata,
                completionContent
            )

            return Response.json(completion, {
                headers: { "Content-Type": "application/json" }
            })
        }

        return createOpenAIStreamResponse(resultStream, responseMetadata)
    } catch (error) {
        console.error("OpenAI compatible completions API error:", error)

        return createOpenAIErrorResponse({
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.",
            code: "internal_server_error",
            status: 500
        })
    }
}
