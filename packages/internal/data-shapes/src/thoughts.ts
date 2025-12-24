/**
 *
 */

import { thoughtSchema } from "@altered/data/shapes"

export const internalThoughtSchema = thoughtSchema.merge({
    kind: '"dataset" | "attribute" | "preference" | null'
})

export const internalReadableThoughtSchema = internalThoughtSchema.or("null")
export const internalCreatableThoughtSchema = internalThoughtSchema.omit("id", "createdAt", "updatedAt")

export type InternalThought = typeof internalThoughtSchema.infer

export type InternalCreatableThought = typeof internalCreatableThoughtSchema.infer
export type InternalReadableThought = typeof internalReadableThoughtSchema.infer

export const internalTestThought = {
    id: "test-thought-id",
    brainId: "test-brain-id",
    kind: null,
    alias: "Test Thought",
    content: "This is a test thought.",
    createdAt: new Date(),
    updatedAt: new Date()
} satisfies InternalThought
