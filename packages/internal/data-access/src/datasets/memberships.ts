/**
 *
 */

import type { DatasetID } from "@altered/data/shapes"
import { type Database, thoughtsToDatasets } from "@altered-internal/data/store"
import { ORPCError } from "@orpc/client"
import { and, eq, inArray } from "drizzle-orm"

/**
 * @todo [P3] Add proper existence checks for the thought and datasets.
 */
export async function addThoughtToDatasets({
    thoughtId,
    datasetIds,
    brainId,
    db
}: {
    thoughtId: string
    datasetIds: DatasetID[]
    brainId: string
    db: Database
}): Promise<void> {
    if (!datasetIds.length) return

    try {
        await db.insert(thoughtsToDatasets).values(
            datasetIds.map(datasetId => ({
                thoughtId,
                datasetId,
                brainId
            }))
        )
    } catch (error) {
        console.error("Error adding thought to datasets:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}

/**
 * @todo [P3] Add proper existence checks for the thought and datasets.
 */
export async function removeThoughtFromDatasets({
    thoughtId,
    datasetIds,
    brainId,
    db
}: {
    thoughtId: string
    datasetIds: DatasetID[]
    brainId: string
    db: Database
}): Promise<void> {
    if (!datasetIds.length) return

    try {
        await db
            .delete(thoughtsToDatasets)
            .where(
                and(
                    eq(thoughtsToDatasets.thoughtId, thoughtId),
                    eq(thoughtsToDatasets.brainId, brainId),
                    inArray(thoughtsToDatasets.datasetId, datasetIds)
                )
            )
    } catch (error) {
        console.error("Error removing thought from datasets:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}

/**
 * @remarks The primary way to update thought-dataset relationships. Overwrites all existing memberships with the new list.
 *
 * @todo
 * - [P3] Add proper existence checks for the thought and datasets.
 * - [P3] We could probably restructure the logic to avoid deleting all memberships when not needed.
 */
export async function setThoughtDatasets({
    thoughtId,
    datasetIds,
    brainId,
    db
}: {
    thoughtId: string
    datasetIds: DatasetID[]
    brainId: string
    db: Database
}): Promise<void> {
    try {
        await db
            .delete(thoughtsToDatasets)
            .where(
                and(
                    eq(thoughtsToDatasets.thoughtId, thoughtId),
                    eq(thoughtsToDatasets.brainId, brainId)
                )
            )

        if (datasetIds.length) {
            await db.insert(thoughtsToDatasets).values(
                datasetIds.map(datasetId => ({
                    thoughtId,
                    datasetId,
                    brainId
                }))
            )
        }
    } catch (error) {
        console.error("Error setting thought datasets:", error)

        throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: error })
    }
}
