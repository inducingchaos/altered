/**
 *
 */

import { createThought, getLatestThought } from "@altered-internal/data/access"
import { internalTestThought } from "@altered-internal/data/shapes"
import { appRouteFactory, protectedRouteFactory } from "./factory"

export const getThoughtsProcedure = protectedRouteFactory.thoughts.get.handler(async () => {
    console.warn("`getThoughts` is using a test value.")

    return { thoughts: [internalTestThought] }
})

export const findThoughtProcedure = protectedRouteFactory.thoughts.find.handler(async () => {
    console.warn("`findThought` is using a test value.")

    return { thought: internalTestThought }
})

export const createThoughtProcedure = protectedRouteFactory.thoughts.create.handler(async ({ input, context }) => ({ thought: await createThought({ thought: { ...input, kind: null }, db: context.db }) }))

export const getLatestThoughtProcedure = appRouteFactory.thoughts.getLatest.handler(async ({ context }) => ({ thought: await getLatestThought({ brainId: context.app.selectedBrainId, db: context.db }) }))

export const thoughtsRouter = {
    get: getThoughtsProcedure,
    find: findThoughtProcedure,
    create: createThoughtProcedure,
    getLatest: getLatestThoughtProcedure
}
