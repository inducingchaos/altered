/**
 *
 */

import { defineRelations } from "drizzle-orm"
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

        systemPreferences: r.many.systemPreferences({
            from: r.users.id,
            to: r.systemPreferences.userId
        }),

        brains: r.many.brains({
            from: r.users.id,
            to: r.brains.userId
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
        })
    }
}))
