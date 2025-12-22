/**
 *
 */

import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { client } from "./rpc-client"

export const api = createTanstackQueryUtils(client)
