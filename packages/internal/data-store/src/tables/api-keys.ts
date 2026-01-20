/**
 *
 */

import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const apiKeys = pgTable(
    "api_keys",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        userId: varchar().notNull(),
        service: varchar().notNull(),
        value: varchar().notNull().unique(),
        lastUsedAt: timestamp(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index("api_keys_user_id_service_idx").on(table.userId, table.service)
    ]
)
