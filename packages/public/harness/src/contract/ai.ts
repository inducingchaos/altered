/**
 *
 */

import { openAIMessageSchema, openrouterModelIdSchema } from "@altered/data/shapes"
import { eventIterator } from "@orpc/contract"
import { type } from "arktype"
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
                    type({
                        messages: openAIMessageSchema.array(),
                        "model?": openrouterModelIdSchema,
                        "temperature?": "number",
                        "maxTokens?": "number",
                        "stream?": "boolean"
                    })
                )
                .output(
                    eventIterator(
                        type({
                            content: "string",
                            "finishReason?": "string",
                            "isComplete?": "boolean"
                        })
                    )
                )
        }
    }
}
