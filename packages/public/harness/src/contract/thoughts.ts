/**
 *
 */

import { creatableThoughtSchema, paginationOptionsSchema, thoughtSchema } from "@altered/data/shapes"
import { type } from "arktype"
import { contractFactory } from "./factory"

export const thoughtsContract = {
    get: contractFactory
        .route({ tags: ["internal"] })
        .input(
            type({
                pagination: paginationOptionsSchema
            })
        )
        .output(
            type({
                thoughts: thoughtSchema.array().or("null")
            })
        ),

    find: contractFactory
        .route({ tags: ["internal"] })
        .input(thoughtSchema.pick("content"))
        .output(
            type({
                thought: thoughtSchema
            })
        ),

    create: contractFactory
        .route({ tags: ["internal"] })
        .input(creatableThoughtSchema)
        .output(
            type({
                thought: thoughtSchema
            })
        ),

    /**
     * @todo [P3] Rather than defining every route manually, we can achieve kebab-case and case-insensitivity implementing a replacer:
     *
     * @see https://orpc.unnoq.com/docs/openapi/integrations/implement-contract-in-nest#define-your-contract
     *
     * `unnoq` says: Loop over all procedure and fill any path you want. like this:
     * @see https://github.com/unnoq/orpc/blob/main/packages/nest/src/utils.ts#L32
     */
    getLatest: contractFactory
        .route({
            method: "GET",
            path: "/get-latest"
        })
        .output(
            type({
                thought: thoughtSchema.or("null")
            })
        ),

    delete: contractFactory
        .route({ tags: ["internal"] })
        .input(thoughtSchema.pick("id"))
        .output(
            type({
                thought: thoughtSchema
            })
        )
}
