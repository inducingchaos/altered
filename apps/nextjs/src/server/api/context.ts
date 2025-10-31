/**
 *
 */

import { Session } from "~/lib/auth/client"
import { Database } from "~/server/data/connection"

type APIBaseContext = { _: { headers: Headers } }
type APIDatabaseContext = { db: Database }

/**
 * @todo [P2] Update with real auth/user type.
 */
type APIAuthContext = { auth: Session }

export type APIContext = APIBaseContext & Partial<APIDatabaseContext> & Partial<APIAuthContext>
export type PublicRouteContext = APIContext & APIDatabaseContext
export type ProtectedRouteContext = APIContext & APIDatabaseContext & APIAuthContext
