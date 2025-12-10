/**
 *
 */

import { AuthContext } from "@altered-internal/auth"
import { Database } from "@altered-internal/data/store"

type APIBaseContext = { _: { headers: Headers } }
type APIDatabaseContext = { db: Database }
type APIAuthContext = { auth: AuthContext }

export type APIContext = APIBaseContext & Partial<APIDatabaseContext> & Partial<APIAuthContext>
export type PublicRouteContext = APIContext & APIDatabaseContext
export type ProtectedRouteContext = APIContext & APIDatabaseContext & APIAuthContext
