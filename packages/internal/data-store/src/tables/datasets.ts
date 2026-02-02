/**
 *
 */

import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const datasets = pgTable(
    "datasets",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        brainId: varchar().notNull(),
        extendingThoughtId: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index("datasets_brain_id_created_at_idx").on(
            table.brainId,
            table.createdAt
        )
    ]
)
