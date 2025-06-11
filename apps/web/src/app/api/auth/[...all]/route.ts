/**
 *
 */

import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@altered-42/auth"

export const { POST, GET } = toNextJsHandler(auth)
