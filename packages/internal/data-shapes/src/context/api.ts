/**
 *
 */

import { AuthContext } from "@altered-internal/auth"
import { Database } from "@altered-internal/data/store"

export type AppContext = { selectedBrainId: string }

export type APIRequestContext = { request: { headers: Headers } }
export type APIDatabaseContext = { db: Database }
export type APIAuthContext = { auth: AuthContext }
export type APIAppContext = { app: AppContext }

export type APIInitialContext = APIRequestContext
export type APIContext = APIInitialContext & Partial<APIDatabaseContext & APIAuthContext & APIAppContext>

export type RouteFactoryContext = APIDatabaseContext
export type AuthenticatedRouteFactoryContext = RouteFactoryContext & APIAuthContext
export type EnrichedRouteFactoryContext = AuthenticatedRouteFactoryContext & APIAppContext
