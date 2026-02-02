/**
 *
 */

import { defineRelations } from "drizzle-orm"
// biome-ignore lint/performance/noNamespaceImport: Used for dynamic access to exports.
import * as tables from "../tables"

export const relations = defineRelations(tables, r => ({
    users: {
        sessions: r.many.sessions({
            from: r.users.id,
            to: r.sessions.userId
        }),
        accounts: r.many.accounts({
            from: r.users.id,
            to: r.accounts.userId
        }),
        oauthApplications: r.many.oauthApplications({
            from: r.users.id,
            to: r.oauthApplications.userId
        }),
        oauthAccessTokens: r.many.oauthAccessTokens({
            from: r.users.id,
            to: r.oauthAccessTokens.userId
        }),
        oauthConsents: r.many.oauthConsents({
            from: r.users.id,
            to: r.oauthConsents.userId
        }),

        apiKeys: r.many.apiKeys({
            from: r.users.id,
            to: r.apiKeys.userId
        }),

        systemPreferences: r.many.systemPreferences({
            from: r.users.id,
            to: r.systemPreferences.userId
        }),

        brains: r.many.brains({
            from: r.users.id,
            to: r.brains.userId
        }),

        chatConversations: r.many.chatConversations({
            from: r.users.id,
            to: r.chatConversations.userId
        }),
        chatDocuments: r.many.chatDocuments({
            from: r.users.id,
            to: r.chatDocuments.userId
        }),
        chatSuggestions: r.many.chatSuggestions({
            from: r.users.id,
            to: r.chatSuggestions.userId
        })
    },
    oauthApplications: {
        oauthAccessTokens: r.many.oauthAccessTokens({
            from: r.oauthApplications.clientId,
            to: r.oauthAccessTokens.clientId
        }),
        oauthConsents: r.many.oauthConsents({
            from: r.oauthApplications.clientId,
            to: r.oauthConsents.clientId
        })
    },

    brains: {
        thoughts: r.many.thoughts({
            from: r.brains.id,
            to: r.thoughts.brainId
        }),
        thoughtJoins: r.many.thoughtJoins({
            from: r.brains.id,
            to: r.thoughtJoins.brainId
        }),
        thoughtMetadata: r.many.thoughtMetadata({
            from: r.brains.id,
            to: r.thoughtMetadata.brainId
        }),

        datasets: r.many.datasets({
            from: r.brains.id,
            to: r.datasets.brainId
        }),

        thoughtsToDatasets: r.many.thoughtsToDatasets({
            from: r.brains.id,
            to: r.thoughtsToDatasets.brainId
        })
    },

    datasets: {
        extendingThought: r.one.thoughts({
            from: r.datasets.extendingThoughtId,
            to: r.thoughts.id
        }),
        thoughts: r.many.thoughts({
            from: r.datasets.id.through(r.thoughtsToDatasets.datasetId),
            to: r.thoughts.id.through(r.thoughtsToDatasets.thoughtId)
        })
    },
    thoughts: {
        fromJoins: r.many.thoughtJoins({
            from: r.thoughts.id,
            to: r.thoughtJoins.fromThoughtId
        }),
        toJoins: r.many.thoughtJoins({
            from: r.thoughts.id,
            to: r.thoughtJoins.toThoughtId
        }),
        metadata: r.many.thoughtMetadata({
            from: r.thoughts.id,
            to: r.thoughtMetadata.thoughtId
        }),

        datasets: r.many.datasets({
            from: r.thoughts.id.through(r.thoughtsToDatasets.thoughtId),
            to: r.datasets.id.through(r.thoughtsToDatasets.datasetId)
        })
    },

    thoughtsToDatasets: {
        thought: r.one.thoughts({
            from: r.thoughtsToDatasets.thoughtId,
            to: r.thoughts.id
        }),
        dataset: r.one.datasets({
            from: r.thoughtsToDatasets.datasetId,
            to: r.datasets.id
        })
    },

    chatConversations: {
        messages: r.many.chatMessages({
            from: r.chatConversations.id,
            to: r.chatMessages.chatId
        }),
        votes: r.many.chatVotes({
            from: r.chatConversations.id,
            to: r.chatVotes.chatId
        }),
        streams: r.many.chatStreams({
            from: r.chatConversations.id,
            to: r.chatStreams.chatId
        }),
        user: r.one.users({
            from: r.chatConversations.userId,
            to: r.users.id
        })
    },
    chatMessages: {
        conversation: r.one.chatConversations({
            from: r.chatMessages.chatId,
            to: r.chatConversations.id
        }),
        votes: r.many.chatVotes({
            from: r.chatMessages.id,
            to: r.chatVotes.messageId
        })
    },
    chatVotes: {
        conversation: r.one.chatConversations({
            from: r.chatVotes.chatId,
            to: r.chatConversations.id
        }),
        message: r.one.chatMessages({
            from: r.chatVotes.messageId,
            to: r.chatMessages.id
        })
    },
    chatDocuments: {
        user: r.one.users({
            from: r.chatDocuments.userId,
            to: r.users.id
        }),
        suggestions: r.many.chatSuggestions({
            from: r.chatDocuments.id,
            to: r.chatSuggestions.documentId
        })
    },
    chatSuggestions: {
        document: r.one.chatDocuments({
            from: r.chatSuggestions.documentId,
            to: r.chatDocuments.id
        }),
        user: r.one.users({
            from: r.chatSuggestions.userId,
            to: r.users.id
        })
    },
    chatStreams: {
        conversation: r.one.chatConversations({
            from: r.chatStreams.chatId,
            to: r.chatConversations.id
        })
    }
}))
