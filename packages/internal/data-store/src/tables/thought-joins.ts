/**
 *
 */

import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const thoughtJoins = pgTable("thought_joins", {
    id: varchar().primaryKey().$defaultFn(nanoid),
    brainId: varchar().notNull(),
    fromThoughtId: varchar().notNull(),
    toThoughtId: varchar().notNull(),
    joinType: varchar().notNull(),
    createdAt: timestamp().notNull().defaultNow()
})
