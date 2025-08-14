/**
 *
 */

import type { Config } from "../types/config"
import { environment } from "./environment"
import { paths } from "./paths"

export default {
    environment,
    paths
} satisfies Config
