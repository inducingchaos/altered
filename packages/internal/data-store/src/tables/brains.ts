/**
 *
 */

import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const brains = pgTable(
    "brains",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        userId: varchar().notNull(),
        name: varchar().notNull(),
        description: varchar(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [index("brains_user_id_created_at_idx").on(table.userId, table.createdAt)]
)
