/**
 *
 */

import { datasetIdSchema, datasetSchema } from "@altered/data/shapes"

export const internalDatasetSchema = datasetSchema.merge({
    brainId: "string"
})

export const internalCreatableDatasetSchema = internalDatasetSchema.merge({
    "id?": datasetIdSchema,
    "createdAt?": "Date"
})

export type InternalDataset = typeof internalDatasetSchema.infer

export type InternalCreatableDataset =
    typeof internalCreatableDatasetSchema.infer
