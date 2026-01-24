/**
 *
 */

import { apiFactory } from "../factory"
import { aggregateRouter } from "./aggregate"
import { aiRouter } from "./ai"
import { authRouter } from "./auth"
import { experimentalRouter } from "./experimental"
import { thoughtsRouter } from "./thoughts"

export const router = apiFactory.router({
    auth: authRouter,

    thoughts: thoughtsRouter,
    ai: aiRouter,

    aggregate: aggregateRouter,
    experimental: experimentalRouter
})

export type Router = typeof router
