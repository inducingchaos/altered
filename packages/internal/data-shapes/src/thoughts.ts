/**
 *
 */

import { thoughtSchema } from "@altered/data/shapes"

export const internalThoughtSchema = thoughtSchema.merge({
    brainId: "string",
    kind: '"dataset" | "attribute" | "preference" | null'
})

export const internalCreatableThoughtSchema = internalThoughtSchema.omit("createdAt", "updatedAt").merge({
    "id?": "string"
})

export type InternalThought = typeof internalThoughtSchema.infer

export type InternalCreatableThought = typeof internalCreatableThoughtSchema.infer

export const internalTestThought = {
    id: "test-thought-id",
    brainId: "test-brain-id",
    kind: null,
    alias: "Test Thought",
    content: "This is a test thought.",
    createdAt: new Date(),
    updatedAt: new Date()
} satisfies InternalThought
