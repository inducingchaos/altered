/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type CursorField = "id" | "created-at"

export type CursorDefinition =
    | { field: "id"; value: string }
    | { field: "created-at"; value: Date }

export type OffsetPaginationOptions = {
    type: "offset"
    offset?: number
    limit?: number
}

export type CursorPaginationOptions = {
    type: "cursor"
    cursors?: CursorDefinition[] | null
    limit?: number
}

export type PaginationOptions =
    | OffsetPaginationOptions
    | CursorPaginationOptions
