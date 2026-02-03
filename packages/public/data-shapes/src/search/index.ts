/**
 *
 */

import { type } from "arktype"
import { searchableThoughtKeySchema } from "../altered-thoughts"

export const genericSearchOptionsSchema = type("<KeyPath extends string>", {
    "query?": "string",
    "keyPaths?": "KeyPath[]",
    "fuzzy?": "boolean"
})

export const thoughtsSearchOptionsSchema = genericSearchOptionsSchema(
    searchableThoughtKeySchema
)

export type ThoughtsSearchOptions = typeof thoughtsSearchOptionsSchema.infer
