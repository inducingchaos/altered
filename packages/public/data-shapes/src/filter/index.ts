/**
 *
 */

import { type } from "arktype"
import { datasetIdSchema } from "../altered-datasets"

export const genericFilterOptionsSchema = type(
    "<IncludeOptions extends Record<string, unknown>>",
    {
        "include?": "IncludeOptions"
    }
)

export const thoughtsFilterOptionsSchema = genericFilterOptionsSchema({
    "datasets?": datasetIdSchema.array()
})

export type ThoughtsFilterOptions = typeof thoughtsFilterOptionsSchema.infer
