/**
 *
 */

import type { AuthContext } from "@altered-internal/auth"
import type { Database } from "@altered-internal/data/store"

export type ProtectedContext = {
    auth: AuthContext
    db: Database
}
