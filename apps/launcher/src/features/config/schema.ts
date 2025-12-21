/**
 * @todo [P4] Figure out if there's a way to prevent circular imports (by moving code to different files) instead of having to import from `~/lib/observability/logger/constants` here.
 */

import { environment } from "@raycast/api"
import { z } from "zod"
import { logLevels, logPartsConfigSchema } from "../observability/logger/constants"

export const configSchema = z
    .object({
        cwd: z.string(),
        environment: z.enum(["development", "production"]),

        logLevel: z.enum(logLevels).optional(),
        logSearch: z.string().optional(),
        logParts: logPartsConfigSchema.optional(),
        logToFile: z.boolean().optional(),

        appName: z.string(),
        appDescription: z.string(),
        appIcon: z.string(),

        productionBaseUrl: z.url(),
        developmentBaseUrl: z.url(),

        oauthProviderId: z.string(),
        oauthProviderDescription: z.string(),

        oauthClientId: z.string(),
        oauthClientScope: z.string()
    })
    .transform(config => {
        return {
            ...config,

            baseUrl: config.environment === "development" ? config.developmentBaseUrl : config.productionBaseUrl,

            appIcon: environment.appearance === "dark" ? config.appIcon.split(".").reduce((previous, current, index, original) => (index === original.length - 1 ? `${previous}@dark.${current}` : previous ? `${previous}.${current}` : current), "") : config.appIcon
        }
    })
    .transform(config => {
        return {
            ...config,

            rpcEndpoint: `${config.baseUrl}/rpc`,

            oauthAuthorizationEndpoint: `${config.baseUrl}/api/auth/oauth2/authorize`,
            oauthTokenEndpoint: `${config.baseUrl}/api/auth/oauth2/token`,
            oauthUserInfoEndpoint: `${config.baseUrl}/api/auth/oauth2/userinfo`,
            oauthRevokeEndpoint: `${config.baseUrl}/api/auth/oauth2/revoke`
        }
    })

export type ConfigDef = z.input<typeof configSchema>
export type Config = z.output<typeof configSchema>
