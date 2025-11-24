/**
 *
 */

import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import { application } from "~/config"

export default defineConfig({
    schema: "./src/server/data/schema",
    dialect: "postgresql",
    dbCredentials: { url: application.env.database.url },
    casing: "snake_case"
})
