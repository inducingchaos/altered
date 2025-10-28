/**
 *
 */

import { IncomingHttpHeaders } from "http"
import { Database } from "~/server/data/connection"

type APIBaseContext = { _: { headers: IncomingHttpHeaders } }
type APIDatabaseContext = { db: Database }

/**
 * @todo [P2] Update with real auth/user type.
 */
type APIAuthContext = { user: { id: string; name: string } }

export type APIContext = APIBaseContext & Partial<APIDatabaseContext> & Partial<APIAuthContext>
export type PublicRouteContext = APIContext & APIDatabaseContext
export type ProtectedRouteContext = APIContext & APIDatabaseContext & APIAuthContext
