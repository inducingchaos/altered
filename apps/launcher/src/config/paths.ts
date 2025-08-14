/**
 *
 */

import type { PathsConfig } from "../types/config"

export const paths = {
    api: {
        base: "/api",
        endpoints: {
            auth: "/auth",
            trpc: "/trpc"
        }
    }
} satisfies PathsConfig
