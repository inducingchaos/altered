/**
 *
 */

import { drizzle } from "drizzle-orm/postgres-js"
import { application } from "@altered-internal/config"
import { relations } from "./relations"
import * as tables from "./tables"

export const db = drizzle(application.env.database.url, { relations, casing: "snake_case", schema: tables })

export type Database = typeof db

export * from "./tables"
export * from "./relations"

export { eq, or, sql } from "drizzle-orm"
