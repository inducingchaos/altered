/**
 *
 */

import { type } from "arktype"

export const internalThoughtSchema = type({
    id: "string",
    /**
     * @todo [P1] Drop once migrated to brain-owned thought schema.
     */
    userId: "string",
    brainId: "string",
    kind: '"dataset" | "attribute" | "preference" | null',
    alias: "string | null",
    content: "string | null",
    createdAt: "Date",
    updatedAt: "Date"
})

export const internalReadableThoughtSchema = internalThoughtSchema.or("null")
export const internalCreatableThoughtSchema = internalThoughtSchema.omit("id", "createdAt", "updatedAt")

export type InternalThought = typeof internalThoughtSchema.infer

export type InternalCreatableThought = typeof internalCreatableThoughtSchema.infer
export type InternalReadableThought = typeof internalReadableThoughtSchema.infer

export const internalTestThought = {
    id: "test-thought-id",
    userId: "test-user-id",
    brainId: "test-brain-id",
    kind: null,
    alias: "Test Thought",
    content: "This is a test thought.",
    createdAt: new Date(),
    updatedAt: new Date()
} satisfies InternalThought
