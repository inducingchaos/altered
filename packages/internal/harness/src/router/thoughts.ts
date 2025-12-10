/**
 *
 */

import { nanoid } from "nanoid"
import { getLatestThought as _getLatestThought } from "@altered-internal/data/access"
import { protectedRouteFactory } from "./factory"

export const getThoughts = protectedRouteFactory.thoughts.get.handler(async ({ context }) => {
    const testThoughts = { thoughts: [{ id: nanoid(), userId: context.auth.user.id, content: "Hello, world!", createdAt: new Date(), updatedAt: new Date() }] }

    console.log(`Retrieved thoughts: ${JSON.stringify(testThoughts)}`)
    return testThoughts
})

export const findThought = protectedRouteFactory.thoughts.find.handler(async ({ context }) => {
    const testThought = { id: nanoid(), userId: context.auth.user.id, content: "Hello, world!", createdAt: new Date(), updatedAt: new Date() }

    console.log(`Found thought: ${JSON.stringify(testThought)}`)
    return { thought: testThought }
})

export const createThought = protectedRouteFactory.thoughts.create.handler(async ({ input, context }) => {
    const testThought = { id: nanoid(), userId: context.auth.user.id, content: input.content, createdAt: new Date(), updatedAt: new Date() }

    console.log(`Created thought: ${JSON.stringify(testThought)}`)
    return { thought: testThought }
})

export const getLatestThought = protectedRouteFactory.thoughts.getLatest.handler(async ({ context }) => _getLatestThought({ ctx: context }))

export const thoughtsRouter = {
    get: getThoughts,
    find: findThought,
    create: createThought,
    getLatest: getLatestThought
}
