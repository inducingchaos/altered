/**
 *
 */

import { z } from "zod"

export const identitySchema = z.object({
    name: z.string(),
    description: z.string()
})

export type IdentityConfig = z.input<typeof identitySchema>
export type Identity = z.output<typeof identitySchema>
