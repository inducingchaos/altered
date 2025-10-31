/**
 *
 */

import * as authSchemas from "./auth"
import * as thoughtsSchemas from "./thoughts"

export const allSchemas = {
    ...authSchemas,
    ...thoughtsSchemas
}

export * from "./auth"
export * from "./thoughts"
