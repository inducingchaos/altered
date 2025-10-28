/**
 *
 */

import { implement } from "@orpc/server"
import { APIContext } from "./context"
import { contract } from "./contract"

/**
 * Completely replaces `os` from @orpc/server adding type-safety that adheres to the API contract.
 */
export const apiFactory = implement(contract).$context<APIContext>()
