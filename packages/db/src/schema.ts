/**
 *
 */

import type { z } from "zod"
import { relations } from "drizzle-orm"
import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { nanoid } from "nanoid"

//  Auth.

export const users = pgTable("users", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    name: varchar().notNull(),
    email: varchar().notNull(),
    emailVerified: boolean().notNull().default(false),
    image: varchar(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),

    thoughts: many(thoughts)
}))

export const sessions = pgTable("sessions", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    userId: varchar().notNull(),
    token: varchar().notNull(),
    expiresAt: timestamp().notNull(),
    ipAddress: varchar(),
    userAgent: varchar(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}))

export const accounts = pgTable("accounts", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    userId: varchar().notNull(),
    accountId: varchar().notNull(),
    providerId: varchar().notNull(),
    accessToken: varchar(),
    refreshToken: varchar(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: varchar(),
    idToken: varchar(),
    password: varchar(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}))

export const verifications = pgTable("verifications", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    identifier: varchar().notNull(),
    value: varchar().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

//  Thoughts.

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

export const thoughtsRelations = relations(thoughts, ({ one }) => ({
    user: one(users, {
        fields: [thoughts.userId],
        references: [users.id]
    })
}))

export const creatableThoughtSchema = createInsertSchema(thoughts).omit({
    id: true,
    createdAt: true,
    updatedAt: true
})

//  Disambiguate between these. We could infer insert, or "allow" certain properties via the Zod schema.

export type Thought = typeof thoughts.$inferSelect
export type CreatableThought = z.infer<typeof creatableThoughtSchema>
