/**
 *
 */

import { authenticatedRouteFactory, routeFactory } from "./factory"

export const experimentalRouter = {
    test: routeFactory.experimental.test.handler(({ input }) => {
        return { success: input.hello === "world" }
    }),

    protectedTest: authenticatedRouteFactory.experimental.protectedTest.handler(
        ({ input }) => {
            return { success: input.hello === "world" }
        }
    )
}
