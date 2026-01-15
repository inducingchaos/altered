/**
 *
 */

import { type } from "arktype"

const idCursorDefinitionSchema = type({
    field: "'id'",
    value: "string"
})

const createdAtCursorDefinitionSchema = type({
    field: "'created-at'",
    value: "Date"
})

const cursorDefinitionSchema = idCursorDefinitionSchema.or(createdAtCursorDefinitionSchema)

export type CursorField = (typeof cursorDefinitionSchema.infer)["field"]
export type CursorDefinition = typeof cursorDefinitionSchema.infer

const offsetPaginationOptionsSchema = type({
    type: "'offset'",
    "offset?": "number.integer >= 0",
    "limit?": "1 <= number.integer <= 100"
})

export type OffsetPaginationOptions = typeof offsetPaginationOptionsSchema.infer

const cursorPaginationOptionsSchema = type({
    type: "'cursor'",
    "cursors?": cursorDefinitionSchema.array().or("null"),
    "limit?": "1 <= number.integer <= 100"
})

export type CursorPaginationOptions = typeof cursorPaginationOptionsSchema.infer

export const paginationOptionsSchema = offsetPaginationOptionsSchema.or(cursorPaginationOptionsSchema)

export type PaginationOptions = typeof paginationOptionsSchema.infer
