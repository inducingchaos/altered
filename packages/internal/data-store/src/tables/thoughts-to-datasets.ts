/**
 *
 */

import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core"

export const thoughtsToDatasets = pgTable(
    "thoughts_to_datasets",
    {
        thoughtId: varchar().notNull(),
        datasetId: varchar().notNull(),
        brainId: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow()
    },
    table => [primaryKey({ columns: [table.thoughtId, table.datasetId] })]
)
