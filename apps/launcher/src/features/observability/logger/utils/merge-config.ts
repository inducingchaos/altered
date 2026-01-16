/**
 *
 */

import type { LoggerConfig } from "../constants"

export const mergeLoggerConfig = (
    base?: LoggerConfig,
    override?: LoggerConfig
): LoggerConfig => ({
    parts: {
        ...base?.parts,
        ...override?.parts
    },
    defaults: {
        ...base?.defaults,
        ...override?.defaults
    },
    filter: {
        ...base?.filter,
        ...override?.filter
    },
    plugins: [...(base?.plugins ?? []), ...(override?.plugins ?? [])]
})
