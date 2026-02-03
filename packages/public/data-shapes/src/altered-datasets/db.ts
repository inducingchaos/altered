/**
 *
 */

import { type } from "arktype"
import { thoughtSchema } from "../altered-thoughts"

export const datasetIdSchema = type("string").brand("Dataset ID")

/**
 * @remarks We could transform this to have a more client-friendly signature - including the `alias` and `content` of the representing Thought. This translation would be for aesthetics and ergonomics. There is also a very small chance we may re-implement this as a Thought on the database level.
 */
export const datasetSchema = type({
    id: datasetIdSchema,
    representingThoughtId: "string",
    createdAt: "Date"
})

export const creatableDatasetSchema = datasetSchema
    .omit("createdAt")
    .merge({ "id?": "string" })

export const queryableDatasetSchema = datasetSchema.pick("id")

export type DatasetID = typeof datasetIdSchema.infer
export type Dataset = typeof datasetSchema.infer

export type CreatableDataset = typeof creatableDatasetSchema.infer
export type QueryableDataset = typeof queryableDatasetSchema.infer

/**
 * @todo
 * - [P3] We should rename to better reflect the additional properties, and help disambiguate it from Thoughts in a Dataset.
 * - [P3] We should clarify the resulting properties, including those nested, to show only one `createdAt`/`updatedAt` per entity - since this type is considered to be one whole.
 */
export const datasetWithThoughtSchema = datasetSchema.merge({
    representingThought: thoughtSchema
})

export type DatasetWithThought = typeof datasetWithThoughtSchema.infer
