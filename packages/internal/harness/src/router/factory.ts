/**
 *
 */

import { onError, ORPCError, ValidationError } from "@orpc/server"
import { AppRouteFactoryContext, ProtectedRouteFactoryContext, PublicRouteFactoryContext } from "../context"
import { apiFactory } from "../factory"
import { appContextProvider, checkVersion, dbProvider, logError, requireAuth } from "../middleware"

/**
 * Logs expanded Type Validation errors to the console.
 *
 * @todo [P3] Move this to a middleware.
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

const publicRouteMiddleware = logError.concat(onError(logValidationError)).concat(checkVersion).concat(dbProvider)
const protectedRouteMiddleware = publicRouteMiddleware.concat(requireAuth)
const appRouteMiddleware = protectedRouteMiddleware.concat(appContextProvider)

export const publicRouteFactory = apiFactory.use<PublicRouteFactoryContext>(publicRouteMiddleware)
export const protectedRouteFactory = apiFactory.use<ProtectedRouteFactoryContext>(protectedRouteMiddleware)
export const appRouteFactory = apiFactory.use<AppRouteFactoryContext>(appRouteMiddleware)
