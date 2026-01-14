/**
 *
 */

import { generateChatCompletion } from "@altered-internal/data/access"
import { ORPCError } from "@orpc/client"
import { enrichedRouteFactory } from "./factory"

/**
 * @remarks Removed the title detection and diversion logic. For OpenAI-compatible endpoints, we should handle title JSON requests just like any other request.
 */
const generateOpenAICompatibleCompletionsProcedure = enrichedRouteFactory.ai.generate.completions.openAICompatible.handler(async function* ({ input, context }) {
    try {
        const stream = generateChatCompletion({
            input: {
                messages: input.messages,
                temperature: input.temperature,
                maxTokens: input.maxTokens,
                stream: input.stream
            },
            options: {
                modelId: input.model
            },
            context: {
                db: context.db,
                brainId: context.app.selectedBrainId
            }
        })

        for await (const chunk of stream) {
            yield { content: chunk, isComplete: false }
        }

        yield { content: "", finishReason: "stop", isComplete: true }
    } catch (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
})

export const aiRouter = {
    generate: {
        completions: {
            openAICompatible: generateOpenAICompatibleCompletionsProcedure
        }
    }
}
