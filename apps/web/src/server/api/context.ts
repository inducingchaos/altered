/**
 *
 */

import { AuthContext } from "~/lib/auth/client"
import { Database } from "~/server/data/connection"

type APIBaseContext = { _: { headers: Headers } }
type APIDatabaseContext = { db: Database }
type APIAuthContext = { auth: AuthContext }

export type APIContext = APIBaseContext & Partial<APIDatabaseContext> & Partial<APIAuthContext>
export type PublicRouteContext = APIContext & APIDatabaseContext
export type ProtectedRouteContext = APIContext & APIDatabaseContext & APIAuthContext
