/**
 *
 */

import { auth } from "@altered-internal/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
