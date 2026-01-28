/**
 * @todo [P4] Figure out if there's a way to prevent circular imports (by moving code to different files) instead of having to import from `~/lib/observability/logger/constants` here.
 */

import { environment } from "@raycast/api"
import type {
    LogLevel,
    LogPartsConfig
} from "../observability/logger/constants"
import { defineConfig } from "./builder"

export type ConfigDefinition = {
    cwd: string
    overrideEnvironment?: "development" | "production"

    logLevel?: LogLevel
    logSearch?: string
    logParts?: LogPartsConfig
    logToFile?: boolean

    appName: string
    appDescription: string
    appIcon: string
    appVersion: string

    apiDelay?: number

    themeIcons: boolean

    listPaginationLimit: number

    productionBaseUrl: string
    developmentBaseUrl: string

    oauthProviderId: string
    oauthProviderDescription: string

    oauthClientId: string
    oauthClientScope: string
}

function addDarkModifierToFilePath(filePath: string): string {
    const modifier = "@dark"
    const possibleExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"]

    const extension = possibleExtensions.find(ext => filePath.endsWith(ext))
    if (!extension) return `${filePath}${modifier}`

    return `${filePath.slice(0, -extension.length)}${modifier}${extension}`
}

const configBuilder = defineConfig<ConfigDefinition, true>()

const configWithDefaults = configBuilder.default({
    overrideEnvironment: "development"
})

const configWithEnvironment = configWithDefaults.transform(config => ({
    ...config,

    environment: environment.isDevelopment
        ? config.overrideEnvironment
        : "production",

    appIcon:
        environment.appearance === "dark"
            ? addDarkModifierToFilePath(config.appIcon)
            : config.appIcon
}))

const configWithOrigins = configWithEnvironment.transform(config => ({
    ...config,

    baseUrl:
        config.environment === "development"
            ? config.developmentBaseUrl
            : config.productionBaseUrl
}))

const configWithPaths = configWithOrigins.transform(config => ({
    ...config,

    rpcEndpoint: `${config.baseUrl}/rpc`,
    oauthAuthorizationEndpoint: `${config.baseUrl}/api/auth/oauth2/authorize`,
    oauthTokenEndpoint: `${config.baseUrl}/api/auth/oauth2/token`,
    oauthUserInfoEndpoint: `${config.baseUrl}/api/auth/oauth2/userinfo`,
    oauthRevokeEndpoint: `${config.baseUrl}/api/auth/oauth2/revoke`
}))

export const configFactory = configWithPaths
