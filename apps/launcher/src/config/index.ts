/**
 * @todo [P0] Add a runtime config override that intercepts the config like we do with transform, but allows for us to change the values while the app is running. (we may be be able to swap this value in-memory but since `config` is evaluated immediately, simply changing a property may not work. It may need to be converted to a function. Additionally, I'm not sure how we would observe this in React for "view" commands.) The main use case for this is to add an `environmentOverride` property that we can set to preview/production while in dev, and be able to set that from within the running Raycast extension.
 * @todo [P0] Remove the `environment` property as it should auto-change based on the `NODE_ENV` environment variable.
 */

import { ConfigDef, configSchema } from "./schema"

export const configDef = {
    environment: "development",

    logLevel: "debug",
    logComponents: {
        timestamp: true
    },

    appName: "ALTERED",
    appDescription: "Knowledge systems for the obsessed.",
    appIcon: "extension-icon.png",

    developmentBaseUrl: "http://localhost:258",
    productionBaseUrl: "https://altered.app",

    oauthProviderId: "altered",
    oauthProviderDescription: "Connect your ALTERED account to your thoughts.",

    oauthClientId: "altered-launcher",
    oauthClientScope: "openid profile email offline_access"
} satisfies ConfigDef

export const config = configSchema.parse(configDef)
