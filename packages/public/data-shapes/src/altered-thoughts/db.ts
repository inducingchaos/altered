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

/**
 * @remarks We may need to update this to allow submitting the creation/modified date from the client, as an optional parameter. `addedAt` should remain untouchable as the default indicator of when the Thought was added to the database.
 */
export const creatableThoughtSchema = thoughtSchema
    .omit("createdAt", "updatedAt", "addedAt")
    .merge({ "id?": "string" })
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
