/**
 *
 */

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { application } from "~/config"
import * as schema from "./schema"

const client = postgres(application.env.database.url, { prepare: false })
export const db = drizzle({ client, schema, casing: "snake_case" })

export type Database = typeof db
