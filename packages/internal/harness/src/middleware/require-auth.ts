/**
 *
 */

import { auth } from "@altered-internal/auth"
import { apiFactory } from "../factory"

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
