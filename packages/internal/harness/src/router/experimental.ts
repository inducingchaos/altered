/**
 *
 */

import { protectedRouteFactory, publicRouteFactory } from "./factory"

export const experimentalRouter = {
    test: publicRouteFactory.experimental.test.handler(async ({ input }) => {
        return { success: input.hello === "world" }
    }),

    protectedTest: protectedRouteFactory.experimental.protectedTest.handler(async ({ input }) => {
        return { success: input.hello === "world" }
    })
}
