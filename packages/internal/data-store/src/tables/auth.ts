/**
 *
 */

import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

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

export const sessions = pgTable("sessions", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    userId: varchar().notNull(),
    token: varchar().notNull().unique(),
    expiresAt: timestamp().notNull(),
    ipAddress: varchar(),
    userAgent: varchar(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

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

export const oauthApplications = pgTable("oauth_applications", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    clientId: varchar().notNull().unique(),
    clientSecret: varchar(),
    name: varchar().notNull(),
    redirectUrls: varchar().notNull(),
    metadata: varchar(),
    type: varchar().notNull(),
    disabled: boolean().notNull().default(false),
    userId: varchar().references(() => users.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

export const oauthAccessTokens = pgTable("oauth_access_tokens", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    accessToken: varchar().notNull(),
    refreshToken: varchar().notNull(),
    accessTokenExpiresAt: timestamp().notNull(),
    refreshTokenExpiresAt: timestamp().notNull(),
    /**
     * @remarks The recommended FK to `oauthApplications.clientId` errors when using trusted OIDC clients without having them as a database entry - disabling the reference works for now.
     *
     * @see https://github.com/better-auth/better-auth/issues/6649
     */
    clientId: varchar().notNull(),
    // .references(() => oauthApplications.clientId),
    userId: varchar()
        .notNull()
        .references(() => users.id),
    scopes: varchar().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

export const oauthConsents = pgTable("oauth_consents", {
    id: varchar().primaryKey().notNull().$defaultFn(nanoid),
    userId: varchar()
        .notNull()
        .references(() => users.id),
    clientId: varchar()
        .notNull()
        .references(() => oauthApplications.clientId),
    scopes: varchar().notNull(),
    consentGiven: boolean().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})
