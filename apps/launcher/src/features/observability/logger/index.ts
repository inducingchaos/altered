/**
 *
 */

import { config } from "~/config"
import { createLogger } from "./create"
import { logToFile } from "./plugins"

export const logger = createLogger({
    filter: { level: config.logLevel, search: config.logSearch },
    parts: config.logParts,
    plugins: [
        //  We have to set the `cwd` manually because Raycast modifies `process.cwd()` to return `/` and `__dirname` to return the folder in the Raycast extensions directory.

        logToFile({
            enabled: config.logToFile,
            cwd: config.cwd,
            relativePath: "./.logs/app.log"
        })
    ]
})

/**
 * @remarks This alias allows us to write `const logger = configureLogger({ ... })` and use `logger`, where previously calling `logger.configure` meant we would have to rename it to something else. Could be refactored - this works for now.
 */
export const configureLogger = logger.configure
