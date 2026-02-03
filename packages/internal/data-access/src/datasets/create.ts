/**
 *
 */

import { type DatasetWithThought, datasetSchema } from "@altered/data/shapes"
import { isNanoid } from "@altered/utils"
import type {
    InternalCreatableDataset,
    InternalCreatableThought
} from "@altered-internal/data/shapes"
import { type Database, datasets, thoughts } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"

/**
 * @todo
 * - [P3] Wrap in a transaction to make atomic.
 * - [P3] Consider letting this be the transform layer between the public and internal dataset shapes (or, do it on the API contract that calls this). See {@link datasetSchema}.
 */
export async function createDataset({
    dataset,
    representingThought,
    db
}: {
    dataset: InternalCreatableDataset
    representingThought: InternalCreatableThought
    db: Database
}): Promise<DatasetWithThought> {
    if (
        (dataset.id && !isNanoid(dataset.id)) ||
        (representingThought.id && !isNanoid(representingThought.id))
    )
        throw new ORPCError("BAD_REQUEST", { message: "Invalid ID format." })

    try {
        const [createdThought] = await db
            .insert(thoughts)
            .values(representingThought)
            .returning()

        if (!createdThought)
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Failed to create representing Thought for Dataset."
            })

        const [createdDataset] = await db
            .insert(datasets)
            .values(dataset)
            .returning()

        if (!createdDataset)
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Failed to create dataset."
            })

        return {
            ...createdDataset,

            representingThought: createdThought
        }
    } catch (error) {
        console.error("Error creating dataset:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
