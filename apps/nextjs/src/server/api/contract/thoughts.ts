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
    getLatest: contractFactory.route({ method: "GET", path: "/get-latest" }).output(
        type({
            thought: thoughtSchema.optional()
        })
    )
}
