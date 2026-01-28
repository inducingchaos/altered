/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export const modelIds = ["kai-v1"] as const

export type ModelID = (typeof modelIds)[number]
