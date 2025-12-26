/**
 *
 */

import { auth } from "@altered-internal/auth"
import { apiFactory } from "../factory"

export const requireAuth = apiFactory.middleware(async ({ context, next, errors }) => {
    const { data: session, error: sessionError } = await auth.api.getSession({ headers: context.request.headers })

    if (sessionError) throw errors[sessionError.code]({ message: sessionError.message, cause: sessionError.cause })

    return next({ context: { auth: session } })
})
