/**
 *
 */

import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { type } from "arktype"

export const thoughtSchema = type({
    id: "string",
    userId: "string",
    content: "string",
    createdAt: "Date",
    updatedAt: "Date"
})
export type Thought = typeof thoughtSchema.infer
export const creatableThoughtSchema = thoughtSchema.omit("id", "createdAt", "updatedAt")
export type CreatableThought = typeof creatableThoughtSchema.infer

export const thoughts = pgTable("thoughts", {
    id: varchar().primaryKey().$defaultFn(nanoid),
    userId: varchar().notNull(),
    content: varchar().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})
