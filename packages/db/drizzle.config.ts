/**
 *
 */

import { defineConfig } from "drizzle-kit"

//  TODO: Setup `t3-env`.

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL")

const nonPoolingUrl = process.env.DATABASE_URL.replace("6543", "5432")

export default defineConfig({
    schema: ["./src/schema.ts"],
    dialect: "postgresql",
    dbCredentials: {
        url: nonPoolingUrl
    },
    casing: "snake_case"
})
