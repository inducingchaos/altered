/**
 *
 */

import { authBase } from "./base"
import { getAmbiguousSession, getOAuth2Session } from "./extensions"

export const auth = {
    ...authBase,
    api: {
        ...authBase.api,
        getCookieSession: authBase.api.getSession,
        getOAuth2Session,
        getSession: getAmbiguousSession
    }
}

export type AuthContext = typeof auth.$Infer.Session
