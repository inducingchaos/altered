/**
 *
 */

import type { EnvironmentConfig } from "../types/config"

export const environment = {
    mode: "development",
    baseUrl: {
        development: "https://wrkkgc19-5873.usw2.devtunnels.ms",
        production: "https://altered.app"
    }
} satisfies EnvironmentConfig
