/**
 *
 */

import { createOrpcErrorLogger } from "@altered/harness"
import { onError } from "@orpc/server"
import { apiFactory } from "../factory"

export const logError = apiFactory.middleware(
    onError(createOrpcErrorLogger({ enable: true, preset: "server" }))
)
