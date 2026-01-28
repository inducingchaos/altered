/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export const openrouterModelIds = ["google/gemini-2.5-flash-lite"] as const

export type OpenrouterModelID = (typeof openrouterModelIds)[number]
