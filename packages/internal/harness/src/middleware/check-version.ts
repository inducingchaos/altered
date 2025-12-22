/**
 *
 */

import { apiFactory } from "../factory"
import { checkVersionCompatibility } from "../utils"

export const checkVersion = apiFactory.middleware(
    async ({
        context: {
            _: { headers }
        },
        next,
        errors
    }) => {
        const clientVersion = headers.get("x-client-version")

        if (!clientVersion) throw errors.BAD_REQUEST({ message: "Supplying a client version with the request is required." })

        /**
         * @todo [P2] Get server version from config or environment variable.
         */
        const serverVersion = "0.1.0"

        if (!checkVersionCompatibility(clientVersion, serverVersion)) {
            throw errors.VERSION_INCOMPATIBLE({
                message: `Client version (${clientVersion}) is incompatible with server version (${serverVersion}). Please update the extension.`
            })
        }

        return next()
    }
)
