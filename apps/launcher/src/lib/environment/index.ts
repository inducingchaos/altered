/**
 *
 */

import config from "../../config"

export const baseUrl =
    config.environment.mode === "development" ? config.environment.baseUrl.development : config.environment.baseUrl.production
