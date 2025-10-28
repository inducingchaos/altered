/**
 *
 */

import { implement } from "@orpc/server"
import type { IncomingHttpHeaders } from "http"
import { contract } from "./contract"

/**
 * Completely replaces `os` from @orpc/server adding type-safety that adheres to the API contract.
 */
export const apiFactory = implement(contract).$context<{
    _: {
        headers: IncomingHttpHeaders
    }
    db?: "database-connection-type"
    user?: { name: string }
}>()
