/**
 *
 */

export const modelIds = ["kai-v1"] as const

export type ModelID = (typeof modelIds)[number]
