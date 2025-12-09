/**
 *
 */

import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import { application } from "~/config"

export default defineConfig({
    schema: "./src/server/data/store",
    dialect: "postgresql",
    dbCredentials: {
        /**
         * @remarks Fix for hang on introspect with `drizzle-kit push`.
         */
        url: application.env.database.url.replace(":6543", ":5432")
    },
    casing: "snake_case",

    /**
     * @remarks Required to negate the rest of the Supabase schemas.
     */
    schemaFilter: ["public"]
})
