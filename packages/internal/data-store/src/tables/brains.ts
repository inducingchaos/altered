/**
 *
 */

import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const brains = pgTable("brains", {
    id: varchar().primaryKey().$defaultFn(nanoid),
    userId: varchar().notNull(),
    name: varchar().notNull(),
    description: varchar(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})
