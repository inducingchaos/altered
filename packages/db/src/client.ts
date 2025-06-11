/**
 *
 */

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

//  TODO: Set up `t3-env`.

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL")

const client = postgres(process.env.DATABASE_URL, { prepare: false })
export const db = drizzle({ client, schema, casing: "snake_case" })
export type Database = typeof db
