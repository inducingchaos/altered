/**
 *
 */

import { getApiKey, validateApiKey } from "@altered-internal/data/access"
import { protectedRouteFactory } from "./factory"

export const getApiKeyProcedure = protectedRouteFactory.auth.apiKeys.get.handler(async ({ input, context }) => await getApiKey({ ...input, context: { db: context.db, userId: context.auth.user.id } }))

export const validateApiKeyProcedure = protectedRouteFactory.auth.apiKeys.validate.handler(async ({ input, context }) => await validateApiKey({ ...input, context: { db: context.db } }))

export const authRouter = {
    apiKeys: {
        get: getApiKeyProcedure,
        validate: validateApiKeyProcedure
    }
}
