/**
 *
 */

import { AuthContext } from "@altered-internal/auth"
import { AppContext } from "@altered-internal/data/access"
import { Database } from "@altered-internal/data/store"

export type APIRequestContext = { request: { headers: Headers } }
export type APIDatabaseContext = { db: Database }
export type APIAuthContext = { auth: AuthContext }
export type APIAppContext = { app: AppContext }

export type APIInitialContext = APIRequestContext
export type APIContext = APIInitialContext & Partial<APIDatabaseContext & APIAuthContext & APIAppContext>

export type PublicRouteContext = APIInitialContext & APIDatabaseContext
export type ProtectedRouteContext = PublicRouteContext & APIAuthContext
export type AppRouteContext = ProtectedRouteContext & APIAppContext
