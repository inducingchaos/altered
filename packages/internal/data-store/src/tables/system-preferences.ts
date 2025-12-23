/**
 *
 */

import { index, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const systemPreferences = pgTable(
    "system_preferences",
    {
        id: varchar().primaryKey().$defaultFn(nanoid),
        userId: varchar().notNull(),
        key: varchar().notNull(),
        value: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [index("system_preferences_user_id_key_idx").on(table.userId, table.key), unique("system_preferences_user_id_key_unique").on(table.userId, table.key)]
)
