/**
 *
 */

import { apiFactory } from "../factory"
import { experimentalRouter } from "./experimental"
import { thoughtsRouter } from "./thoughts"

export const router = apiFactory.router({
    thoughts: thoughtsRouter,
    experimental: experimentalRouter
})
