/**
 *
 */

import { type } from "arktype"

export const thoughtSchema = type({
    id: "string",
    userId: "string",
    content: "string",
    createdAt: "Date",
    updatedAt: "Date"
})

export type Thought = typeof thoughtSchema.infer
export const creatableThoughtSchema = thoughtSchema.omit("id", "createdAt", "updatedAt")
export type CreatableThought = typeof creatableThoughtSchema.infer
