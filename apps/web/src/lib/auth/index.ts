/**
 *
 */

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { nanoid } from "nanoid"
import { application, localization } from "~/config"
import { db } from "~/server/data/store"

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

    plugins: [nextCookies()],

    advanced: { database: { generateId: () => nanoid() } }
})
