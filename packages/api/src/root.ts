/**
 *
 */

import { experimentalRouter } from "./router/experimental"
import { thoughtsRouter } from "./router/thoughts"
import { usersRouter } from "./router/users"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    users: usersRouter,

    experimental: experimentalRouter,

    thoughts: thoughtsRouter
})

/**
 * The tRPC router.
 */
export type AppRouter = typeof appRouter
