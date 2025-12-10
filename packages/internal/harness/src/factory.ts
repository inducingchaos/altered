/**
 *
 */

import { contract } from "@altered/harness"
import { implement } from "@orpc/server"
import { APIContext } from "./context"

/**
 * Completely replaces `os` from @orpc/server adding type-safety that adheres to the API contract.
 */
export const apiFactory = implement(contract).$context<APIContext>()
