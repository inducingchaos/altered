/**
 * Tables for "web-chat".
 */

import {
    boolean,
    index,
    jsonb,
    pgTable,
    primaryKey,
    timestamp,
    unique,
    varchar
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const chatConversations = pgTable(
    "chat_conversations",
    {
        id: varchar().primaryKey().notNull().$defaultFn(nanoid),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date()),
        title: varchar().notNull(),
        userId: varchar().notNull(),
        visibility: varchar({ enum: ["public", "private"] })
            .notNull()
            .default("private")
    },
    table => [
        index("chat_conversations_user_id_created_at_idx").on(
            table.userId,
            table.createdAt
        )
    ]
)

export const chatMessages = pgTable(
    "chat_messages",
    {
        id: varchar().primaryKey().notNull().$defaultFn(nanoid),
        chatId: varchar().notNull(),
        role: varchar().notNull(),
        parts: jsonb().notNull(),
        attachments: jsonb().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index("chat_messages_chat_id_created_at_idx").on(
            table.chatId,
            table.createdAt
        )
    ]
)

export const chatVotes = pgTable(
    "chat_votes",
    {
        id: varchar().primaryKey().notNull().$defaultFn(nanoid),
        chatId: varchar().notNull(),
        messageId: varchar().notNull(),
        isUpvoted: boolean().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [unique().on(table.chatId, table.messageId)]
)

/**
 * @todo [P3] Review need for the composite key if keeping long-term. Related to versioning?
 */
export const chatDocuments = pgTable(
    "chat_documents",
    {
        id: varchar().notNull().$defaultFn(nanoid),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date()),
        title: varchar().notNull(),
        content: varchar(),
        kind: varchar({ enum: ["text", "code", "image", "sheet"] })
            .notNull()
            .default("text"),
        userId: varchar().notNull()
    },
    table => [
        primaryKey({ columns: [table.id, table.createdAt] }),

        index("chat_documents_user_id_created_at_idx").on(
            table.userId,
            table.createdAt
        )
    ]
)

export const chatSuggestions = pgTable(
    "chat_suggestions",
    {
        id: varchar().primaryKey().notNull().$defaultFn(nanoid),
        documentId: varchar().notNull(),
        documentCreatedAt: timestamp().notNull(),
        originalText: varchar().notNull(),
        suggestedText: varchar().notNull(),
        description: varchar(),
        isResolved: boolean().notNull().default(false),
        userId: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [index("chat_suggestions_document_id_idx").on(table.documentId)]
)

export const chatStreams = pgTable(
    "chat_streams",
    {
        id: varchar().primaryKey().notNull(),
        chatId: varchar().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index("chat_streams_chat_id_created_at_idx").on(
            table.chatId,
            table.createdAt
        )
    ]
)
