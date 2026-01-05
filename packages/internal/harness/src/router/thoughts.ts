/**
 *
 */

import { createThought, deleteThought, getLatestThought, getThoughts, updateThought } from "@altered-internal/data/access"
import { internalTestThought } from "@altered-internal/data/shapes"
import { appRouteFactory, protectedRouteFactory } from "./factory"

/**
 * @todo [P2] Investigate why this route takes ~1,400ms to complete.
 */
export const getThoughtsProcedure = appRouteFactory.thoughts.get.handler(
    async ({ input, context }) =>
        await getThoughts({
            pagination: input.pagination,
            context: { brainId: context.app.selectedBrainId, db: context.db }
        })
)

export const findThoughtProcedure = protectedRouteFactory.thoughts.find.handler(async () => {
    console.warn("`findThought` is using a test value.")

    return { thought: internalTestThought }
})

export const createThoughtProcedure = appRouteFactory.thoughts.create.handler(async ({ input, context }) => ({
    thought: await createThought({
        thought: {
            brainId: context.app.selectedBrainId,
            kind: null,
            ...input
        },
        db: context.db
    })
}))

export const getLatestThoughtProcedure = appRouteFactory.thoughts.getLatest.handler(async ({ context }) => ({ thought: await getLatestThought({ brainId: context.app.selectedBrainId, db: context.db }) }))

export const deleteThoughtProcedure = appRouteFactory.thoughts.delete.handler(async ({ input, context }) => ({
    thought: await deleteThought({
        id: input.id,
        brainId: context.app.selectedBrainId,
        db: context.db
    })
}))

export const updateThoughtProcedure = appRouteFactory.thoughts.update.handler(async ({ input: { query, values }, context }) => ({
    thought: await updateThought({
        query: { ...query, brainId: context.app.selectedBrainId },
        values,
        context
    })
}))

export const thoughtsRouter = {
    get: getThoughtsProcedure,
    find: findThoughtProcedure,
    create: createThoughtProcedure,
    getLatest: getLatestThoughtProcedure,
    delete: deleteThoughtProcedure,
    update: updateThoughtProcedure
}
