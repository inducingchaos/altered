/**
 *
 */

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { allSchemas as schema } from "./schemas"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.")

/**
 * @todo [P2] Add `.env` validation.
 */
const client = postgres(process.env.DATABASE_URL, { prepare: false })
export const db = drizzle({ client, schema, casing: "snake_case" })

export type Database = typeof db
