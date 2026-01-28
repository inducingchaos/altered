/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { APIKey, GetApiKeyInput, ValidateApiKeyInput } from "@altered/core"
import { type } from "@orpc/contract"
import { contractFactory } from "./factory"

export const authContract = {
    apiKeys: {
        get: contractFactory
            .route({
                tags: ["internal"]
            })
            .input(type<GetApiKeyInput>())
            .output(type<{ apiKey: APIKey | null }>()),

        validate: contractFactory
            .route({
                tags: ["internal"]
            })
            .input(type<ValidateApiKeyInput>())
            .output(type<{ userId: string } | null>())
    }
}
