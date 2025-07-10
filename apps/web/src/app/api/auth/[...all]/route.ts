/**
 *
 */

import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@altered/auth"

export const { POST, GET } = toNextJsHandler(auth)
