/**
 * @todo [P3] Resolve ambiguity between the `ALTEREDThought` construct and the `Thought` type.
 */

import { type } from "arktype"

export type ALTEREDThought<ID extends string = string> = {
    id: ID

    /**
     * An arbitrary name/title for the Thought.
     *
     * @remarks Named "alias" to reinforce the abstract nature of the "thought" construct, and how it is a secondary identifier that describes the content of a Thought.
     */
    alias: string

    /**
     * A sentence-like description of the Thought.
     *
     * @remarks Named "content" to avoid the redundancy of "thought" and the associations to "description", since Thought content should be a pure channeling of one's inner voice, rather than a summarization of it.
     */
    content: string
}

export const thoughtSchema = type({
    id: "string",
    alias: "string | null",
    content: "string | null",
    createdAt: "Date",
    updatedAt: "Date"
})

/**
 * @todo [P4] We could extrapolate this to accept any property of the Thought (as a union - or even more complex with and/or clauses), but for most cases, an ID is sufficient.
 */
export const queryableThoughtSchema = thoughtSchema.pick("id")
export const mutableThoughtSchema = thoughtSchema.omit("id", "createdAt", "updatedAt")

export type Thought = typeof thoughtSchema.infer
export type QueryableThought = typeof queryableThoughtSchema.infer
export type MutableThought = typeof mutableThoughtSchema.infer
