/**
 *
 */

import { z } from "zod"

export const configSchema = z
    .object({
        environment: z.enum(["development", "production"]),

        productionBaseUrl: z.url(),
        developmentBaseUrl: z.url()
    })
    .transform(config => {
        return {
            ...config,

            baseUrl: config.environment === "development" ? config.developmentBaseUrl : config.productionBaseUrl
        }
    })

export type ConfigDef = z.input<typeof configSchema>
export type Config = z.output<typeof configSchema>
