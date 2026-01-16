/**
 *
 */

import {
    type ConsoleLogType,
    type LogLevel,
    logLevelWeights,
    logTypeToLogLevel
} from "../constants"

export const shouldLogAtLevel = ({
    logType,
    logLevel
}: {
    logType: ConsoleLogType
    logLevel: LogLevel
}) => {
    if (logLevel === "quiet") return false

    const logLevelForType = logTypeToLogLevel[logType]

    return logLevelWeights[logLevelForType] >= logLevelWeights[logLevel]
}
