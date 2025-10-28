/**
 *
 */

import { type } from "arktype"

export const thoughtSchema = type({
    id: "string",
    content: "string",
    createdAt: "string.date.iso",
    updatedAt: "string.date.iso"
})
export type Thought = typeof thoughtSchema.infer

export const creatableThoughtSchema = thoughtSchema.omit("id", "createdAt", "updatedAt")
export type CreatableThought = typeof creatableThoughtSchema.infer
