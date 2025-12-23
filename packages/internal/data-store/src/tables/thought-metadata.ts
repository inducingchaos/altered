/**
 *
 */

import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const thoughtMetadata = pgTable("thought_metadata", {
    id: varchar().primaryKey().$defaultFn(nanoid),
    brainId: varchar().notNull(),
    thoughtId: varchar().notNull(),
    key: varchar().notNull(),
    value: varchar().notNull(),
    createdAt: timestamp().notNull().defaultNow()
})
