/**
 *
 */

import { index, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const thoughtJoins = pgTable(
    "thought_joins",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        brainId: varchar().notNull(),
        fromThoughtId: varchar().notNull(),
        toThoughtId: varchar().notNull(),
        joinType: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow()
    },
    table => [
        index("thought_joins_brain_id_join_type_from_idx").on(
            table.brainId,
            table.joinType,
            table.fromThoughtId
        ),
        index("thought_joins_brain_id_join_type_to_idx").on(
            table.brainId,
            table.joinType,
            table.toThoughtId
        ),
        unique("thought_joins_brain_id_from_to_type_unique").on(
            table.brainId,
            table.fromThoughtId,
            table.toThoughtId,
            table.joinType
        )
    ]
)
