/**
 *
 */

import { env } from "../env"
import { ComputedLocationsConfig, LocationsConfig, locationsOutputSchema } from "./schema"

const locationsConfig: LocationsConfig = {
    origins: {
        preview: "https://preview.altered.app",
        production: "https://altered.app"
    },

    paths: {
        pages: {
            home: "/"
        },
        routes: {
            api: "/api",
            rpc: "/rpc"
        },
        external: {}
    },

    aliases: {}
}

const devOrigin = locationsConfig.origins.development ?? `http://localhost:${env.system.port ?? "258"}`
const previewOrigin = locationsConfig.origins.preview ?? env.system.vercel.branchUrl
const prodOrigin = locationsConfig.origins.production ?? env.system.vercel.productionUrl ? `https://${env.system.vercel.productionUrl}` : undefined

const currentOrigin = () => {
    const environment = env.config.overrides.environment ?? env.system.vercel.environment ?? "development"

    if (environment === "development") return devOrigin
    if (environment === "preview") return previewOrigin
    if (environment === "production") return prodOrigin
}

const computedLocationsConfig: ComputedLocationsConfig = {
    ...locationsConfig,

    origins: {
        ...locationsConfig.origins,

        current: currentOrigin(),

        development: devOrigin,
        preview: previewOrigin,
        production: prodOrigin
    },

    aliases: {
        ...locationsConfig.aliases
    }
}

export const locations = locationsOutputSchema.parse(computedLocationsConfig)
