/**
 *
 */

import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@altered-internal/auth"

export const { POST, GET } = toNextJsHandler(auth)
