/**
 *
 */

import { type } from "arktype"

export const openrouterModelIdSchema = type("'google/gemini-2.5-flash-lite'")

export type OpenrouterModelID = typeof openrouterModelIdSchema.infer
