/**
 *
 */

import { publicRouteFactory } from "./factory"

export const experimentalRouter = {
    test: publicRouteFactory.experimental.test.handler(async ({ input }) => {
        return { success: input.hello === "world" }
    })
}
