/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type APIKey = {
    id: string
    service: string
    value: string
    lastUsedAt: Date | null
    createdAt: Date
    updatedAt: Date
}
