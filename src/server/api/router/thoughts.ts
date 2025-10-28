/**
 *
 */

import { protectedRouteFactory } from "./factory"
import { dbProvider, requireAuth } from "../middleware"
import { nanoid } from "nanoid"

export const getThoughts = protectedRouteFactory.thoughts.get.handler(async ({ input }) => {
    const testThoughts = { thoughts: [{ id: nanoid(), content: "Hello, world!", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }

    console.log(`Retrieved thoughts: ${JSON.stringify(testThoughts)}`)
    return testThoughts
})

export const findThought = protectedRouteFactory.thoughts.find.handler(async ({ input }) => {
    const testThought = { id: nanoid(), content: "Hello, world!", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }

    console.log(`Found thought: ${JSON.stringify(testThought)}`)
    return { thought: testThought }
})

export const createThought = protectedRouteFactory.thoughts.create.handler(async ({ input, context }) => {
    const testThought = { id: nanoid(), content: input.content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }

    console.log(`Created thought: ${JSON.stringify(testThought)}`)
    return { thought: testThought }
})

export const thoughtsRouter = {
    get: getThoughts,
    find: findThought,
    create: createThought
}
