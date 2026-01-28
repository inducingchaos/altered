/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { OpenAITextMessage, OpenrouterModelID } from "@altered/core"
import { eventIterator, type } from "@orpc/contract"
import { contractFactory } from "./factory"

/**
 * @todo [P2] Add endpoint for AI SDK completions as well.
 */
export const aiContract = {
    generate: {
        completions: {
            openAICompatible: contractFactory
                .route({
                    /**
                     * @todo [P1] Make this the official OpenAI-compatible completions route. Requires potentially moving the RPC route handler, OR just using the OpenAPI route handler.
                     */
                    path: undefined
                })
                .input(
                    type<{
                        messages: OpenAITextMessage[]
                        model?: OpenrouterModelID
                        temperature?: number
                        maxTokens?: number
                        stream?: boolean
                    }>()
                )
                .output(eventIterator(type<string>()))
        }
    }
}
