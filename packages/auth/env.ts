/**
 *
 */

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        AUTH_SECRET: z.string().min(1),
        AUTH_GOOGLE_ID: z.string().min(1),
        AUTH_GOOGLE_SECRET: z.string().min(1),

        NODE_ENV: z.enum(["development", "production"]).optional()
    },
    client: {
        NEXT_PUBLIC_BASE_URL: z.string().min(1),
        NEXT_PUBLIC_PROD_URL: z.string().min(1)
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL
    },
    skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint"
})
