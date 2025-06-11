/**
 *
 */

import { expo } from "@better-auth/expo"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { oAuthProxy } from "better-auth/plugins"
import { nanoid } from "nanoid"

import { db } from "@altered-42/db/client"

import { env } from "../env"

export const auth = betterAuth({
    appName: "Altered: 42",
    baseURL: env.NEXT_PUBLIC_BASE_URL,
    basePath: "/api/auth",
    secret: env.AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true
    }),
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
            redirectURI: `${env.NEXT_PUBLIC_PROD_URL}${"/api/auth/callback/google"}`
        }
    },
    plugins: [
        nextCookies(),
        oAuthProxy({
            currentURL: env.NEXT_PUBLIC_BASE_URL,
            productionURL: env.NEXT_PUBLIC_PROD_URL
        }),
        expo()
    ],
    trustedOrigins: [env.NEXT_PUBLIC_BASE_URL, "altered-42://"],
    advanced: {
        database: {
            generateId: () => nanoid()
        }
    }
})

export type Session = typeof auth.$Infer.Session
