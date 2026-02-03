/**
 *
 */

import type { DatasetID } from "@altered/data/shapes"
import type { InternalDataset } from "@altered-internal/data/shapes"
import {
    type Database,
    datasets,
    thoughtsToDatasets
} from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and, eq } from "drizzle-orm"

/**
 * @remarks Since we use Drizzle relations and not foreign key constraints, cascade deletes are handled at the application level.
 *
 * @todo [P3] Consider and enhance checks for other dependencies on the representing Thought before deletion.
 */
export async function deleteDataset({
    id,
    brainId,
    db
}: {
    id: DatasetID
    brainId: string
    db: Database
}): Promise<InternalDataset> {
    try {
        await db
            .delete(thoughtsToDatasets)
            .where(
                and(
                    eq(thoughtsToDatasets.datasetId, id),
                    eq(thoughtsToDatasets.brainId, brainId)
                )
            )

        const [deletedDataset] = await db
            .delete(datasets)
            .where(and(eq(datasets.id, id), eq(datasets.brainId, brainId)))
            .returning()

        if (!deletedDataset)
            throw new ORPCError("NOT_FOUND", {
                message:
                    "Dataset not found or you do not have permission to delete it."
            })

        return deletedDataset
    } catch (error) {
        if (error instanceof ORPCError) throw error

        console.error("Error deleting dataset:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
