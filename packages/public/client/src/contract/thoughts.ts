/**
 * @todo [P4] Duplicate of contract in @altered/harness - resolve.
 */

import type {
    CreatableThought,
    PaginationOptions,
    QueryableThought,
    Thought,
    UpdatableThought
} from "@altered/core"
import { type } from "@orpc/contract"
import { contractFactory } from "./factory"

export const thoughtsContract = {
    get: contractFactory
        .route({ tags: ["internal"] })
        .input(
            type<{
                pagination: PaginationOptions
            }>()
        )
        .output(
            type<{
                thoughts: Thought[] | null
                hasMore: boolean
            }>()
        ),

    find: contractFactory
        .route({ tags: ["internal"] })
        .input(type<{ content: string }>())
        .output(
            type<{
                thought: Thought
            }>()
        ),

    create: contractFactory
        .route({ tags: ["internal"] })
        .input(type<CreatableThought>())
        .output(
            type<{
                thought: Thought
            }>()
        ),

    createMany: contractFactory
        .route({
            tags: ["internal"],
            path: "/create-many"
        })
        .input(
            type<{
                thoughts: CreatableThought[]
            }>()
        )
        .output(
            type<{
                thoughts: Thought[]
            }>()
        ),

    update: contractFactory
        .route({ tags: ["internal"] })
        .input(
            type<{
                query: QueryableThought
                values: UpdatableThought
            }>()
        )
        .output(
            type<{
                thought: Thought
            }>()
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
            type<{
                thought: Thought | null
            }>()
        ),

    delete: contractFactory
        .route({ tags: ["internal"] })
        .input(type<QueryableThought>())
        .output(
            type<{
                thought: Thought
            }>()
        )
}
