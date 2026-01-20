/**
 *
 */

import { application, localization } from "@altered-internal/config"
import { db } from "@altered-internal/data/store"
import { betterAuth, isProduction } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { oidcProvider } from "better-auth/plugins"
import { nanoid } from "nanoid"
import { oidcProviderPolyfill } from "./polyfills/oidc-provider"

/**
 * @remarks We can't use wildcard origins (yet) because we also use this array for our CORS middleware, and it doesn't support wildcard origins.
 */
export const trustedOrigins = [
    "http://localhost:258",
    "https://altered.app",

    "http://localhost:3000",
    "https://chat.altered.app"
]

export const authBase = betterAuth({
    appName: localization.identity.name,

    baseURL: application.locations.origins.current,

    secret: application.env.auth.internal.secret,

    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true
    }),

    socialProviders: {
        google: {
            clientId: application.env.auth.google.id,
            clientSecret: application.env.auth.google.secret
        }
    },

    trustedOrigins,

    plugins: [
        nextCookies(),

        oidcProvider({
            loginPage: "/sign-in",

            trustedClients: [
                {
                    clientId: "altered-launcher",
                    name: "ALTERED for Raycast",
                    type: "public",

                    /**
                     * @remarks Not technically needed, but some BetterAuth endpoints expect a non-empty client value (so we set one to avoid errors).
                     */
                    clientSecret: "placeholder-secret",

                    icon: "icon.png",
                    redirectUrls: [
                        "https://raycast.com/redirect?packageName=Extension"
                    ],
                    disabled: false,
                    skipConsent: true,
                    metadata: { platform: "raycast" }
                }
            ]
        }),
        oidcProviderPolyfill()
    ],

    advanced: {
        crossSubDomainCookies: {
            enabled: isProduction,
            domain: application.locations.origins.production
        },

        database: { generateId: () => nanoid() }
    }
})
