/**
 *
 */

import { getApiKey, validateApiKey } from "@altered-internal/data/access"
import { authenticatedRouteFactory } from "./factory"

export const getApiKeyProcedure =
    authenticatedRouteFactory.auth.apiKeys.get.handler(
        async ({ input, context }) =>
            await getApiKey({
                ...input,
                context: { db: context.db, userId: context.auth.user.id }
            })
    )

export const validateApiKeyProcedure =
    authenticatedRouteFactory.auth.apiKeys.validate.handler(
        async ({ input, context }) =>
            await validateApiKey({ ...input, context: { db: context.db } })
    )

export const authRouter = {
    apiKeys: {
        get: getApiKeyProcedure,
        validate: validateApiKeyProcedure
    }
}
