/**
 *
 */

import { generateChatCompletion, generateChatTitle, isChatTitleGenerationRequest } from "@altered-internal/data/access"
import { ORPCError } from "@orpc/client"
import { enrichedRouteFactory } from "./factory"

const generateOpenAICompatibleCompletionsProcedure = enrichedRouteFactory.ai.generate.completions.openAICompatible.handler(async function* ({ input, context }) {
    const isTitleGeneration = isChatTitleGenerationRequest(input.messages)

    try {
        const stream = isTitleGeneration
            ? generateChatTitle({
                  input: {
                      messages: input.messages,
                      temperature: input.temperature,
                      maxTokens: input.maxTokens
                  },
                  options: {
                      modelId: input.model
                  }
              })
            : generateChatCompletion({
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

        for await (const chunk of stream)
            yield {
                content: typeof chunk === "string" ? chunk : JSON.stringify(chunk),
                isComplete: false
            }

        yield {
            content: "",
            finishReason: "stop",
            isComplete: true
        }
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
