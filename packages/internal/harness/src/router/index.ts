/**
 *
 */

import { apiFactory } from "../factory"
import { aiRouter } from "./ai"
import { authRouter } from "./auth"
import { experimentalRouter } from "./experimental"
import { thoughtsRouter } from "./thoughts"

export const router = apiFactory.router({
    auth: authRouter,

    thoughts: thoughtsRouter,
    ai: aiRouter,

    experimental: experimentalRouter
})

export type Router = typeof router
