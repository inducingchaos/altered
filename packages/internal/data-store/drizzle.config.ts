/**
 *
 */

import "dotenv/config"
import { defineConfig } from "drizzle-kit"

/**
 * @todo [P3] Rewrite "config" package to lazy-load environment variables, so that we can use server + client vars in the same config object (or limited ENV configurations like this one) without validation errors if the variable isn't even being used. Start by mimicking the "launcher" config style, keeping it flat, and developing a simple version before getting creative.
 */
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl)
    throw new Error("DATABASE_URL environment variable is required.")

export default defineConfig({
    schema: ["./src/tables/index.ts", "./src/relations/index.ts"],
    dialect: "postgresql",
    dbCredentials: {
        /**
         * @remarks Fixes the hang issue when introspecting with `drizzle-kit push`.
         */
        url: databaseUrl.replace(":6543", ":5432")
    },
    casing: "snake_case",

    /**
     * @remarks Negates the rest of the Supabase SQL schemas.
     */
    schemaFilter: ["public"]
})
