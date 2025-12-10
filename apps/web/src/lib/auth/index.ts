/**
 *
 */

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { oidcProvider } from "better-auth/plugins"
import { nanoid } from "nanoid"
import { application, localization } from "~/config"
import { db } from "~/server/data/store"
import { oidcProviderPolyfill } from "./polyfills/oidc-provider"

export const auth = betterAuth({
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
                    redirectUrls: ["https://raycast.com/redirect?packageName=Extension"],
                    disabled: false,
                    skipConsent: true,
                    metadata: { platform: "raycast" }
                }
            ]
        }),
        oidcProviderPolyfill()
    ],

    advanced: { database: { generateId: () => nanoid() } }
})
