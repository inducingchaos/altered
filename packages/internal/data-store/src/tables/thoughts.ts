/**
 *
 */

import { index, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const thoughts = pgTable(
    "thoughts",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        /**
         * @todo [P1] Drop once migrated to brain-owned thought schema.
         */
        userId: varchar().notNull(),
        brainId: varchar().notNull(),
        kind: varchar({ enum: ["dataset", "attribute", "preference"] }),
        alias: varchar(),
        content: varchar(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [index("thoughts_brain_id_created_at_idx").on(table.brainId, table.createdAt), index("thoughts_brain_id_kind_idx").on(table.brainId, table.kind)]
)
