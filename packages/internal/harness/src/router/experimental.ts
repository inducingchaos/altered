/**
 *
 */

import { authenticatedRouteFactory, routeFactory } from "./factory"

export const experimentalRouter = {
    test: routeFactory.experimental.test.handler(async ({ input }) => {
        return { success: input.hello === "world" }
    }),

    protectedTest: authenticatedRouteFactory.experimental.protectedTest.handler(
        async ({ input }) => {
            return { success: input.hello === "world" }
        }
    )
}
