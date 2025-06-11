/**
 *
 */

import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
    clientPrefix: "EXPO_PUBLIC_",
    client: {
        EXPO_PUBLIC_BASE_URL: z.string().url()
    },
    runtimeEnv: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        EXPO_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    }
})
