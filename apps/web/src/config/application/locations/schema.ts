/**
 * @todo [P4] Refactor this to a flat, tag-based JSON or TS config schema, with sensible internal defaults. This is getting overcomplicated.
 *
 * @remarks The inputs/outputs could be defined in one schema - see the "env" config schema for reference.
 */

import { z } from "zod"

/**
 * @remarks Allows optional input but requires a URL at runtime.
 */
const runtimeUrlSchema = z.string().optional().pipe(z.url())

export const locationsOutputSchema = z.object({
    origins: z.object({
        current: runtimeUrlSchema,

        development: z.url(),
        preview: runtimeUrlSchema,
        production: runtimeUrlSchema
    }),
    paths: z.object({
        pages: z.object({
            home: z.string()
        }),
        routes: z.object({
            api: z.string(),
            rpc: z.string()
        }),
        external: z.object({})
    }),

    aliases: z.object({})
})

/**
 * @remarks The purpose of this override schema is to make certain properties optional, which can be done in several ways. This allows for the omission of values so that we can instead compute them using "middleware" style logic.
 */
export const locationsInputSchema = locationsOutputSchema.extend({
    origins: locationsOutputSchema.shape.origins.partial({
        current: true,

        development: true,
        preview: true,
        production: true
    }),
    aliases: locationsOutputSchema.shape.aliases.extend({})
})

export type LocationsConfig = z.infer<typeof locationsInputSchema>
export type ComputedLocationsConfig = z.input<typeof locationsOutputSchema>

export type Locations = z.output<typeof locationsOutputSchema>
