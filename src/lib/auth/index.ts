/**
 * @todo [P2] Add validation for `.env` values.
 */

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { nanoid } from "nanoid"
import { db } from "~/server/data/connection"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true
    }),
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
        }
    },
    plugins: [nextCookies()],
    advanced: {
        database: {
            generateId: () => nanoid()
        }
    }
})
