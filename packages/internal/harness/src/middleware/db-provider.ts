/**
 *
 */

import { db } from "@altered-internal/data/store"
import { apiFactory } from "../factory"

export const dbProvider = apiFactory.middleware(({ next }) =>
    next({ context: { db } })
)
