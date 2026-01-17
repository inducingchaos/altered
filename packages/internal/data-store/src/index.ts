/**
 *
 */

import { application } from "@altered-internal/config"
import { drizzle } from "drizzle-orm/postgres-js"
import { relations } from "./relations"
// biome-ignore lint/performance/noNamespaceImport: Used for dynamic access to exports.
import * as tables from "./tables"

export const db = drizzle(application.env.database.url, {
    relations,
    casing: "snake_case",
    schema: tables
})

export type Database = typeof db

export { eq, or, sql } from "drizzle-orm"
export * from "./relations"
export * from "./tables"
