/**
 *
 */

import { type } from "arktype"
import { creatableThoughtSchema, thoughtSchema } from "~/server/data/schemas"
import { contractFactory } from "./factory"

export const thoughtsContract = {
    get: contractFactory
        .route({ tags: ["internal"] })
        .input(
            type({
                cursor: "number.integer >= 0",
                "limit?": "1 <= number.integer <= 100"
            })
        )
        .output(
            type({
                thoughts: thoughtSchema.array()
            })
        ),

    find: contractFactory.input(thoughtSchema.pick("content")).output(
        type({
            thought: thoughtSchema
        })
    ),

    create: contractFactory.input(creatableThoughtSchema).output(
        type({
            thought: thoughtSchema
        })
    ),

    getLatest: contractFactory.output(
        type({
            thought: thoughtSchema.optional()
        })
    )
}
