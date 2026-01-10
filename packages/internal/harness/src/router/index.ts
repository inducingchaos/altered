/**
 *
 */

import { apiFactory } from "../factory"
import { authRouter } from "./auth"
import { experimentalRouter } from "./experimental"
import { thoughtsRouter } from "./thoughts"

export const router = apiFactory.router({
    auth: authRouter,

    thoughts: thoughtsRouter,
    experimental: experimentalRouter
})

export type Router = typeof router
