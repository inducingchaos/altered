/**
 *
 */

import { AuthenticatedRouteFactoryContext, EnrichedRouteFactoryContext, RouteFactoryContext } from "@altered-internal/data/shapes"
import { onError, ORPCError, ValidationError } from "@orpc/server"
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

const routeMiddleware = logError.concat(onError(logValidationError)).concat(dbProvider)
const clientRouteMiddleware = routeMiddleware.concat(checkVersion)
const authenticatedRouteMiddleware = clientRouteMiddleware.concat(requireAuth)
const enrichedRouteMiddleware = authenticatedRouteMiddleware.concat(appContextProvider)

export const routeFactory = apiFactory.use<RouteFactoryContext>(routeMiddleware)
export const clientRouteFactory = apiFactory.use<RouteFactoryContext>(clientRouteMiddleware)
export const authenticatedRouteFactory = apiFactory.use<AuthenticatedRouteFactoryContext>(authenticatedRouteMiddleware)
export const enrichedRouteFactory = apiFactory.use<EnrichedRouteFactoryContext>(enrichedRouteMiddleware)
