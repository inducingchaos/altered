/**
 *
 */

import { index, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const thoughtMetadata = pgTable(
    "thought_metadata",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        brainId: varchar().notNull(),
        thoughtId: varchar().notNull(),
        key: varchar().notNull(),
        value: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow()
    },
    table => [
        index("thought_metadata_brain_id_thought_id_idx").on(
            table.brainId,
            table.thoughtId
        ),
        index("thought_metadata_brain_id_key_idx").on(table.brainId, table.key),
        unique("thought_metadata_brain_id_thought_id_key_unique").on(
            table.brainId,
            table.thoughtId,
            table.key
        )
    ]
)
