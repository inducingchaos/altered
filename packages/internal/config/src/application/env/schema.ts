/**
 *
 */

import { z } from "zod"

const envVarInputSchema = z.string().optional()

const envVarStringSchema = envVarInputSchema.pipe(z.string().min(1))
const envVarUrlSchema = envVarInputSchema.pipe(z.url())

export const envSchema = z.object({
    config: z.object({
        overrides: z.object({
            environment: envVarInputSchema.pipe(z.enum(["development", "preview", "production"])).optional()
        })
    }),
    database: z.object({
        url: envVarUrlSchema
    }),
    auth: z.object({
        internal: z.object({
            secret: envVarStringSchema
        }),

        google: z.object({
            id: envVarStringSchema,
            secret: envVarStringSchema
        })
    }),
    api: z.object({
        clientVersion: z.string()
    }),
    providers: z.object({
        openrouter: z.object({
            secret: envVarStringSchema
        })
    }),
    system: z.object({
        /**
         * @remarks Omits `test` value, which can be added when we have a use case.
         */
        environment: envVarInputSchema.pipe(z.enum(["development", "production"])).optional(),
        port: envVarStringSchema.optional(),

        vercel: z.object({
            environment: envVarInputSchema.pipe(z.enum(["development", "preview", "production"])).optional(),

            /**
             * @remarks Use `branchUrl`, `productionUrl`, or a fixed URL instead to avoid ambiguity. Vercel functions use this generated domain, which can be falsely compared to your assigned production domain. Use intentionally.
             */
            url: envVarStringSchema.optional(),
            branchUrl: envVarStringSchema.optional(),
            productionUrl: envVarStringSchema.optional()
        })
    })
})

export type ENVConfig = z.input<typeof envSchema>
export type ENV = z.output<typeof envSchema>
