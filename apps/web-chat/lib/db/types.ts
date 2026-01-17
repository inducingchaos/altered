/**
 *
 */

import type {
    chatConversations,
    chatDocuments,
    chatMessages,
    chatStreams,
    chatSuggestions,
    chatVotes
} from "@altered-internal/data/store"
import type { InferSelectModel } from "drizzle-orm"

export type Chat = InferSelectModel<typeof chatConversations>
export type DBMessage = InferSelectModel<typeof chatMessages>
export type Vote = InferSelectModel<typeof chatVotes>
export type Document = InferSelectModel<typeof chatDocuments>
export type Suggestion = InferSelectModel<typeof chatSuggestions>
export type Stream = InferSelectModel<typeof chatStreams>
