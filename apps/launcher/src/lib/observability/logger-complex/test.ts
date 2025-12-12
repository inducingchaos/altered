/**
 *
 */

import { createLogger, log } from "./base"

export function testLogger() {
    /* RUNTIME TESTS */

    //  1. Default logger, title + description
    const defaultLogger = createLogger()
    defaultLogger.info({ title: "1 title", description: "1 description" })

    //  2. Logger with scope, title + description + data
    const scopedLogger = createLogger({ defaults: { scope: "scope" } })
    scopedLogger.debug({ title: "2 title", description: "2 description", data: { test: "test" } })

    //  3. Logger with filter, timestamp
    const filteredLogger = createLogger({ filter: "filter", components: { timestamp: "always" } })
    filteredLogger.info({ scope: "scope", title: "3 title", description: "3 description" })

    //  4. Logger with silent level (nothing should print)
    const silentLogger = createLogger({ level: "silent" })
    silentLogger.error({ title: "4 title", description: "4 description" })

    //  5. Logger with data component disabled
    const noDataLogger = createLogger({ components: { data: "never" } })
    noDataLogger.warn({ title: "5 title", description: "5 description" })

    // 6) description only (no title)
    defaultLogger.info({ description: "6 description-only message" })

    // 7) title only (no description)
    log.info({ title: "7 title-only message", description: "description is required" })

    // 8) no scope provided even though default scope exists (override to undefined)
    scopedLogger.info({ title: "8 auth", description: "no scope override", scope: null })

    // 9) custom components hiding level tag
    const noLevelLogger = createLogger({ components: { level: "never", timestamp: "never" } })
    noLevelLogger.info({ title: "9 no-level", description: "level tag hidden" })

    // 10) global-like log instance use (reuse default logger)
    defaultLogger.error({ title: "10 error", description: "with error" })

    // TYPE TESTING (should error when uncommented)

    const noDataOrScopeAlwaysTitleLogger = createLogger({ components: { data: "never", scope: "never", title: "always" } })
    noDataOrScopeAlwaysTitleLogger.info({ title: "11 title required", description: "no data or scope allowed" })

    // noDataOrScopeAlwaysTitleLogger.info({ description: "no data or scope allowed" })

    // noDataOrScopeAlwaysTitleLogger.info({ title: "11 title required", description: "no data or scope allowed", scope: "test" })

    const noDataOrScopeAlwaysTitleLoggerX = createLogger({ components: { data: "never", scope: "never", title: "always" }, defaults: { title: "test" } })
    noDataOrScopeAlwaysTitleLoggerX.info({ title: "11 title required", description: "no data or scope allowed" })

    // noDataOrScopeAlwaysTitleLoggerX.info({ description: "no data or scope allowed" })

    // noDataOrScopeAlwaysTitleLoggerX.info({ title: "11 title required", description: "no data or scope allowed", scope: "test" })
}
