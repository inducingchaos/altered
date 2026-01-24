/**
 * @todo [P4] Figure out if there's a way to prevent circular imports (by moving code to different files) instead of having to import from `~/lib/observability/logger/constants` here.
 */

import { environment } from "@raycast/api"
import { z } from "zod"
import {
    logLevels,
    logPartsConfigSchema
} from "../observability/logger/constants"

const addDarkModifierToFilePath = (filePath: string) => {
    const modifier = "@dark"
    const possibleExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"]

    const extension = possibleExtensions.find(ext => filePath.endsWith(ext))
    if (!extension) return `${filePath}${modifier}`

    return `${filePath.slice(0, -extension.length)}${modifier}${extension}`
}

export const configSchema = z
    .object({
        cwd: z.string(),
        overrideEnvironment: z
            .enum(["development", "production"])
            .default("development"),

        logLevel: z.enum(logLevels).optional(),
        logSearch: z.string().optional(),
        logParts: logPartsConfigSchema.optional(),
        logToFile: z.boolean().optional(),

        appName: z.string(),
        appDescription: z.string(),
        appIcon: z.string(),
        appVersion: z.string(),

        apiDelay: z.number().optional(),

        themeIcons: z.boolean(),

        listPaginationLimit: z.number(),

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

            environment: environment.isDevelopment
                ? config.overrideEnvironment
                : "production",

            appIcon:
                environment.appearance === "dark"
                    ? addDarkModifierToFilePath(config.appIcon)
                    : config.appIcon
        }
    })
    .transform(config => {
        return {
            ...config,

            baseUrl:
                config.environment === "development"
                    ? config.developmentBaseUrl
                    : config.productionBaseUrl
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
