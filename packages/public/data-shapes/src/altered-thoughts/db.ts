/**
 *
 */

import { type } from "arktype"

export const thoughtSchema = type({
    id: "string",
    alias: "string | null",
    content: "string | null",
    createdAt: "Date",
    updatedAt: "Date",
    addedAt: "Date"
})

export const creatableThoughtSchema = thoughtSchema.omit("addedAt").merge({
    "id?": "string",
    "createdAt?": "Date",
    "updatedAt?": "Date"
})
export const updatableThoughtSchema = thoughtSchema.omit(
    "id",
    "createdAt",
    "updatedAt",
    "addedAt"
)

/**
 * @todo [P4] We could extrapolate this to accept any property of the Thought (as a union - or even more complex with and/or clauses), but for most cases, an ID is sufficient.
 */
export const queryableThoughtSchema = thoughtSchema.pick("id")

export type Thought = typeof thoughtSchema.infer

export type CreatableThought = typeof creatableThoughtSchema.infer
export type UpdatableThought = typeof updatableThoughtSchema.infer

export type QueryableThought = typeof queryableThoughtSchema.infer
