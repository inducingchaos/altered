/**
 *
 */

import { APIContext } from "@altered-internal/data/shapes"
import { contract } from "@altered/harness"
import { implement } from "@orpc/server"

/**
 * Completely replaces `os` from @orpc/server adding type-safety that adheres to the API contract.
 */
export const apiFactory = implement(contract).$context<APIContext>()
