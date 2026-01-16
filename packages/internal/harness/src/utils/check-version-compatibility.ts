/**
 *
 */

/**
 * A client version exception configuration. Server versions are included to automatically invalidate old client exceptions when our server updates.
 */
type ClientVersionException = {
    /**
     * The target client version to allow API access.
     */
    clientVersion: string

    /**
     * The eligible server versions for the client version exception.
     */
    serverVersions: string[]
}

/**
 * @remarks Configurations for backwards compatibility.
 */
const clientVersionExceptions: ClientVersionException[] = [
    // {
    //     clientVersion: "0.1.0",
    //     serverVersions: ["0.1.1"]
    // }
]

function isClientVersionException(
    clientVersion: string,
    serverVersion: string
) {
    const exception = clientVersionExceptions.find(
        exception => exception.clientVersion === clientVersion
    )
    if (!exception) return false

    return exception.serverVersions.includes(serverVersion)
}

/**
 * @todo [P3] Review and make more comprehensive.
 *
 * @remarks If either version is below 1.0.0, we require an exact version match. Otherwise, we only require the major version to match. Accepts exceptions.
 */
export function checkVersionCompatibility(
    clientVersion: string,
    serverVersion: string
) {
    const clientVersionParts = clientVersion.split(".").map(Number)
    const serverVersionParts = serverVersion.split(".").map(Number)

    if (clientVersionParts.length !== 3 || serverVersionParts.length !== 3)
        return false

    if (isClientVersionException(clientVersion, serverVersion)) return true

    const [clientMajor] = clientVersionParts
    const [serverMajor] = serverVersionParts

    if (clientMajor === 0 || serverMajor === 0)
        return clientVersion === serverVersion

    return clientMajor === serverMajor
}
