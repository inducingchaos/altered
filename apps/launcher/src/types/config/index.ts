/**
 *
 */

import type { EnvironmentConfig } from "./environment"
import type { PathsConfig } from "./paths"

export type Config = {
    environment: EnvironmentConfig
    paths: PathsConfig
}

export * from "./environment"
export * from "./paths"
