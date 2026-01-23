/**
 *
 */

import {
    createManyThoughts,
    createThought,
    deleteThought,
    getLatestThought,
    getThoughts,
    updateThought
} from "@altered-internal/data/access"
import { internalTestThought } from "@altered-internal/data/shapes"
import { authenticatedRouteFactory, enrichedRouteFactory } from "./factory"

/**
 * @todo [P2] Investigate why this route takes ~1,400ms to complete.
 */
export const getThoughtsProcedure = enrichedRouteFactory.thoughts.get.handler(
    async ({ input, context }) =>
        await getThoughts({
            pagination: input.pagination,
            context: { brainId: context.app.selectedBrainId, db: context.db }
        })
)

export const findThoughtProcedure =
    authenticatedRouteFactory.thoughts.find.handler(() => {
        console.warn("`findThought` is using a test value.")

        return { thought: internalTestThought }
    })

export const createThoughtProcedure =
    enrichedRouteFactory.thoughts.create.handler(
        async ({ input, context }) => ({
            thought: await createThought({
                thought: {
                    brainId: context.app.selectedBrainId,
                    kind: null,
                    ...input
                },
                db: context.db
            })
        })
    )

export const createManyThoughtsProcedure =
    enrichedRouteFactory.thoughts.createMany.handler(
        async ({ input, context }) => ({
            thoughts: await createManyThoughts({
                thoughts: input.thoughts.map(thought => ({
                    brainId: context.app.selectedBrainId,
                    kind: null,
                    ...thought
                })),
                db: context.db
            })
        })
    )

export const getLatestThoughtProcedure =
    enrichedRouteFactory.thoughts.getLatest.handler(async ({ context }) => ({
        thought: await getLatestThought({
            brainId: context.app.selectedBrainId,
            db: context.db
        })
    }))

export const deleteThoughtProcedure =
    enrichedRouteFactory.thoughts.delete.handler(
        async ({ input, context }) => ({
            thought: await deleteThought({
                id: input.id,
                brainId: context.app.selectedBrainId,
                db: context.db
            })
        })
    )

export const updateThoughtProcedure =
    enrichedRouteFactory.thoughts.update.handler(
        async ({ input: { query, values }, context }) => ({
            thought: await updateThought({
                query: { ...query, brainId: context.app.selectedBrainId },
                values,
                context
            })
        })
    )

export const thoughtsRouter = {
    get: getThoughtsProcedure,
    find: findThoughtProcedure,
    create: createThoughtProcedure,
    createMany: createManyThoughtsProcedure,
    getLatest: getLatestThoughtProcedure,
    delete: deleteThoughtProcedure,
    update: updateThoughtProcedure
}
