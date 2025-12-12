/**
 *
 */

import { z } from "zod"
import { logComponentsConfigSchema, logLevels } from "~/lib/observability/logger"

export const configSchema = z
    .object({
        environment: z.enum(["development", "production"]),

        logLevel: z.enum(logLevels).optional(),
        logSearch: z.string().optional(),
        logComponents: logComponentsConfigSchema.optional(),

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

            baseUrl: config.environment === "development" ? config.developmentBaseUrl : config.productionBaseUrl
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
