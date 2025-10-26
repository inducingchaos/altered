/**
 *
 */

import { onError, ORPCError, ValidationError } from "@orpc/server"
import { apiFactory } from "../factory"
import { dbProvider, requireAuth } from "../middleware"

/**
 * Logs expanded Type Validation errors to the console.
 */
const logValidationError = (error: unknown) => {
    if (error instanceof ORPCError && error.cause instanceof ValidationError) {
        const validationDetails = {
            issues: error.cause.issues,
            data: error.cause.data
        }

        error.message = `${error.cause.message}: ${JSON.stringify(validationDetails, null, 2)}`
        error.stack = undefined
        error.cause = undefined

        throw error

        //  Could alternatively use `console.dir` - gives syntax highlighting but cannot be attached to the built-in error.
    }
}

export const publicRouteFactory = apiFactory.use(onError(logValidationError))
export const protectedRouteFactory = publicRouteFactory.use(dbProvider).use(requireAuth)
