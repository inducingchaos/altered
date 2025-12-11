/**
 *
 */

import { auth } from "@altered-internal/auth"
import { db } from "@altered-internal/data/store"
import { createOrpcErrorLogger } from "@altered/harness"
import { onError } from "@orpc/server"
import { apiFactory } from "../factory"

export const logError = apiFactory.middleware(onError(createOrpcErrorLogger({ enable: true, preset: "server" })))

export const dbProvider = apiFactory.middleware(({ next }) => next({ context: { db } }))

export const requireAuth = apiFactory.middleware(
    async ({
        context: {
            _: { headers }
        },
        next,
        errors
    }) => {
        const { data: session, error: sessionError } = await auth.api.getSession({ headers })

        if (sessionError) throw errors[sessionError.code]({ message: sessionError.message, cause: sessionError.cause })

        return next({ context: { auth: session } })
    }
)
